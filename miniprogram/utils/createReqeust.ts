type requestOptions = WechatMiniprogram.RequestOption & {
  baseUrl?: string;
  /**
   * 前置拦截器, 当提供此参数的时候
   * 返回值会被当作请求参数
   */
  requestInterceptor?: (options: WechatMiniprogram.RequestOption) => WechatMiniprogram.RequestOption;
  /**
   * 响应拦截器, 请求完成后该钩子会被调用
   * 提供 response 参数和 resovle 钩子
   * resolve 一旦被调用其传入的值会被当作整个 Promise 的返回值
   */
  responseInterceptor?: (response: WechatMiniprogram.RequestSuccessCallbackResult, resolve: (result: any) => void) => void;
  /**
   * 错误拦截器, 请求失败后该钩子会被调用
   * 提供 error 参数和 resolve 钩子和 reject 钩子
   * 这些钩子等同于这个 Promise 的 resolve 和 reject
   */
  errorInterceptor?: (error: WechatMiniprogram.GeneralCallbackResult, resolve: (result: any) => void, reject: (reason: any) => void) => void;
}

type requestTask<T> = Promise<T> & { task: WechatMiniprogram.RequestTask }

/**
 * 调用后返回一个请求函数, 基于 wx.request 进行了包装主要提供了:
 * 1. 前置拦截器
 * 2. 响应拦截器
 * 3. 错误拦截器
 * 4. 基础 url
 * 5. Promise 包装的接口以及 Promise.task 的支持
 * 5. 基于闭包提供的配置重载
 * 
 * 上述所描述的配置选项都是再原有 wx.request 上所作的扩展, 原 wx.request 配置不需要做修改.
 * @param param0 请求选项
 */
export function createRequest({ requestInterceptor: outerRequest, responseInterceptor: outerResponse, errorInterceptor: outerError, baseUrl: outerBaseUrl, ...options }: requestOptions) {

  function Request<responseType>({ requestInterceptor, responseInterceptor, errorInterceptor, baseUrl, ...restOptions }: requestOptions) {

    // TOOD: 后面再考虑 各个参数传入 false 的情况
    requestInterceptor = requestInterceptor || outerRequest;
    responseInterceptor = responseInterceptor || outerResponse;
    errorInterceptor = errorInterceptor || outerError;
    const url = (baseUrl || outerBaseUrl) + (restOptions.url || options.url);

    const handler: requestTask<responseType> = new Promise((resolve, reject) => {

      // Object.assign() 第一个参数为 {} 让后续的参数合并到这个对象字面量上
      // 使得每次创建的对象都唯一
      // 最后一个参数 {url} 让基于 baseUrl 计算出的 url 的优先级最高覆盖
      // Request(options) 和 createRequest(options) 中提供的 options 对应的同名选项
      const option = requestInterceptor ? requestInterceptor(Object.assign({}, options, restOptions, { url })) : Object.assign({}, options, restOptions, { url })

      handler.task = wx.request(Object.assign(option, {
        url, success(response) {

          if (responseInterceptor) {
            // TODO: 考虑允许其运行 reject 
            // 一旦调用 reject 则执行 fail 的逻辑
            return responseInterceptor(response, resolve)
          }

          return resolve(response as any)

        }, fail(error) {

          if (errorInterceptor) {
            return errorInterceptor(error, resolve, reject)
          }

          return reject(error);

        }
      } as WechatMiniprogram.RequestOption))

    }) as requestTask<responseType>;

    return handler;
  }

  return Request;
}
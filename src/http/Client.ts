import axios from 'axios'
import { Http } from 'app-types'

class HttpClient {
  public async request<T>(options: Http.RequestOptions) {
    try {
      const result = await axios(
          {
            method: options.method ?? 'get',
            url: options.url,
            headers: options.headers,
            data: options.data
          }
        ),
        data = result.data as Http.Result<T>

      return {
        value: data.value as T,
        error: false,
        code: 200
      } as Http.Result<T>
    } catch(err) {
      const errData = await this.getErrorData(err),
        code = errData ? (errData.code ?? err.response.status) : 400,
        result: Http.Result<null> = {
          code,
          error: true
        }
    
      if (errData)
        result.message = `E${code}: ${errData.message ?? 'No error message provided.'}`
      
      return result
    }
  }

  public getErrorData(err: any): Promise<Http.Result<null> | void> {
    return new Promise(
      (resolve) => {
        if (err.response) {
          const { data } = err.response
        
          resolve(
            (data as Http.Result<null>) ||
            { code: err.response.status, message: err.message }
          )
        } else resolve(undefined)
      }
    )
  }
}

export default HttpClient
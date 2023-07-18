import axios from 'axios'
import { Http } from 'app-types'

class HttpClient {
  public axios = axios.create()

  public async request<T>(options: Http.RequestOptions) {
    try {
      const result = await this.axios(
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
      }
    } catch(err) {
      const errData = await this.getErrorData(err),
        result: Http.Result<null> = { code: 400 }
    
      if (errData)
        result.message = `E${errData.code}: ${errData.message}`
      
      result.error =  true
      result.code = errData ? errData.code : 400

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
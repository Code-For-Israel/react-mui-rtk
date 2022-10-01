import { AxiosRequestConfig } from 'axios'

// We want to expose only a subset of the AxiosRequestConfig interface
export type RequestConfig = Pick<AxiosRequestConfig, 'signal'>

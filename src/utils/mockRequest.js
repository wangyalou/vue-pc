
import axios from "axios";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const instance = axios.create({
  baseURL: "/mock", 
  headers: {
  },
});

instance.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  }
);
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    // console.log("response", response);
    // 判断响应的code是否是200
    if (response.data.code === 200) {
      // 返回成功的响应数据
      return response.data.data;
    }

    const { message } = response.data;
    // 提示错误
    Message.error(message);
    // 功能失败 --> 返回失败的Promise
    return Promise.reject(message);
  },
  // 响应失败：当响应状态码不是 2xx
  (error) => {
    // console.dir(error);
    // 进度条结束
    NProgress.done();
    const message = error.message || "网络错误";
    // 提示错误
    Message.error(message);
    return Promise.reject(message);
  }
);

export default instance;

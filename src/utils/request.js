import axios from "axios";

const instance = axios.create({
  baseURL:'http://127.0.0.1:8089/',
  timeout:5000
});

export function get(url,params) {
    return instance.get(url,{
      params
    });
}

export function post(url,data) {
  return instance.post(url,data)
}

export function del(url) {
  return instance.delete(url)
}
export function put(url,data) {
  return instance.put(url,data);
}

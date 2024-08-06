export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE, PUT",
    "Access-Control-Max-Age": "3600", // 要求浏览器每一小时才发送一次 OPTIONS 进行跨域校验
  });
});

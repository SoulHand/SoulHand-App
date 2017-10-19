export function Auth(rutaSiguiente:any,redireccion:any, callback : Function
  ){
    let session=localStorage.getItem("session");
    if(!session){
      redireccion({
        pathname: `/auth/?url=${rutaSiguiente.location.pathname}`
      })
    }
    let str = sessionStorage.getItem("word-pending");
    let str2 = sessionStorage.getItem("error");
    if (str && !str2){
      redireccion({
        pathname: `/errors/1/words/new`
      })
      sessionStorage.setItem("error", "true");
    }
    session=JSON.parse(session);
    callback();
}
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
    let str3 = sessionStorage.getItem("objetive-pending");
    let str4 = sessionStorage.getItem("error-objetive");
    if (str && !str2){
      redireccion({
        pathname: `/errors/1/words/new`
      })
      sessionStorage.setItem("error", "true");
    }else{
      if (str3 && !str4) {
        redireccion({
          pathname: `/errors/1/objetives/new`
        })
        sessionStorage.setItem("error-objetive", "true");
      } 
    }
    session=JSON.parse(session);
    callback();
}
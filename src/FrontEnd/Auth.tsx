export function Auth(rutaSiguiente:any,redireccion:any, callback : Function
  ){
    let session=localStorage.getItem("session");
    if(!session){
      redireccion({
        pathname: `/auth/?url=${rutaSiguiente.location.pathname}`
      })
    }
    session=JSON.parse(session);
    callback();
}
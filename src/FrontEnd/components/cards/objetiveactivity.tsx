import * as React from 'react'
import {Objetive} from './objetive'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class ObjetiveActivity extends Objetive{
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/activities/${this.props.activity}/objetives/${this.props.objetive._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: CRUD.objetive)=>{
 	        	this.props.delete(data);
 	        }
 		});
   }
 }

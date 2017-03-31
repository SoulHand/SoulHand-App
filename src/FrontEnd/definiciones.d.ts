declare namespace peoples{
	interface people{
		_id:string
		dni:string
		name:string
		birthdate:string
		mode:string
		createDate:string
	}
	interface teachers{
		_id:string
		data:peoples.people,
		interprete:boolean
		_v:number
	}
}
declare namespace users{	
	interface profile{
		_id:string
		username:string
		_v:number
		isAdmin:boolean
		dateCreated:string
		people:peoples.people
	}
	interface sessions{
		_id:string
		privateKeyId:string
		publicKeyId:string
		ip:string
		navigator:string
		dateLastConnect:string
		dateCreated:string
		_v:number
		users:profile
	}	
}

declare namespace props{
	interface teacherItem{
		people:peoples.teachers
		delete:Function
		session:users.sessions
	}
}
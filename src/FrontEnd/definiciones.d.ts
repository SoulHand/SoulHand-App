interface Window{
	settings:any
}
declare namespace crud{
	interface grade{
		_id:string
		_v:number
		name:string
	}
	interface cognition{
		_id:string
		name:string
		description:string
      	words: Array<string>
	}
	interface domain{
		_id:string
		name:string
		_v:number
		cognitions:Array<cognition>
	}
	interface level{
		_id:string
		name:string
		level:Number
		_v:number
	}
	interface objetive{
      __v: Number
      description: string
      name: string
      _id: string
      words: Array<string>
      dateCreated: string
      cognitions: Array<cognition>
      level: Array<level>
      domain: Array<domain>
  	}
	interface activity{
		name: string
  		description: string
  		dateExpire:string
  		teacher: string
		grade:grade
		course: grade
  		_id: string
  		student: Array<peoples.students>
  		dateCreated: string
  		isCompleted: Boolean
  		objetives: Array<objetive>
	}
}
declare namespace compat {
  interface Map {
    [k:string] : any
  }
}
declare namespace peoples{
	interface people{
		_id:string
		dni:string
		name:string
		birthdate:string
		mode:string
		createDate:string
		_v:number
	}
	interface teachers{
		_id:string
		data:peoples.people
		interprete:boolean
		grade?: crud.grade
		_v:number
	}
	interface students{
		_id:string
		_v:number
		data:peoples.people
		grade?: crud.grade
		activities?:any
		physics?:any
		discapacityLevel?:number
	}
	interface parents{
		_id:string
		data:peoples.people
		_v:number
		idStudent:string
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
		user:profile
	}
}

declare namespace Props{
	interface menu{
    	router?:ReactRouter.InjectedRouter
	}
	interface profilebox{
    	router?:ReactRouter.InjectedRouter
    	callback:Function
    	session:users.sessions
	}
	interface tableteacher{
		teachers:Array<peoples.teachers>
		session?:users.sessions
		delete:Function
	}
	interface tableactivities{
		activities:Array<crud.activity>
		delete:Function
		session:users.sessions
	}
	interface teacherItem{
		people?:peoples.teachers
		delete?:Function
		session?:users.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface TeacherCreate{
		router?:ReactRouter.InjectedRouter
	}
	interface promiseTeacherView{
		[k:string] :  | Array<crud.grade>
	}
	interface TeacherURI{
		id:string
	}
	interface TeacherView{
		router?:ReactRouter.InjectedRouter
		routeParams: TeacherURI
	}




















	interface codeError{
		code:string
		message:string
	}
	interface errorState{
		dni?:boolean
		name?:boolean
		phone?:boolean
		email?:boolean
		birthdate?:boolean
		server?:codeError
	}
	interface dataTeachers{
		dni?:boolean
		name?:boolean
		phone?:boolean
		email?:boolean
		birthdate?:boolean
	}
	interface stateUser{
		user:users.profile
	}
	interface teachersParams{
		id:string
	}
	interface teacherState{
		teacher?: peoples.teachers
		teachers?: Array<peoples.teachers>
		error?:errorState
		user?:compat.Map
	}
	interface fieldsTeachers{
		error:errorState,
		radio?:string
	}
	interface parentItem{
		people?:peoples.parents
		delete?:Function
		session?:users.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface studentsItem{
		people?:peoples.parents
		delete?:Function
		session?:users.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface usersItem{
		people?:users.profile
		delete?:Function
		session?:users.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface basic{
		session?:users.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
}

declare namespace states{
	interface menu{
		session: users.sessions
	}
	interface ListTeachers{
		teachers:Array<peoples.teachers>
		search:string
	}
	interface TeacherCreate{
		error: any
		radio:string
	}
	interface TeacherView {
		teacher:peoples.teachers
		error:string
		grades:Array<crud.grade>
		activities:Array<crud.activity>
	}
}
declare namespace Fields {
	interface validator{
		match?:Function
		value:string | Boolean
		required?:Boolean
	}
	interface teacher{
		dni:validator
		name:validator
		phone:validator
		email:validator
		birthdate:validator
		interprete:validator
		genero:validator
	}
}
declare namespace Datas {
    interface Teacher{
			dni:string
			name:string
			phone:string
			email:string
			birthdate:string
		}
}
declare namespace Errors{
	interface teacher{
		dni:Boolean
		name:Boolean
		phone:Boolean
		email:Boolean
		birthdate:Boolean
		server:string
	}
}

interface Window{
	settings:any
	validator:any
}
declare let validator: any;
interface codeError{
	code:string
	message:string
}
declare namespace crud{
	interface physics{
		height: number
		weight:number
		age: number
		_id: string
		date:string
	}
	interface historys{
		_id:string
		description:string
		dateCreated: string
	}
	interface grade{
		_id:string
		_v:number
		name:string
	}
	interface courses{
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
		level:number
		_v:number
	}
	interface objetive{
      __v: number
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
	interface weights{
		_id:string
		height:number
		min:number
		max:number
		genero:string
		__v:number
	}
	interface heights{
		_id:string
		age:number
		min:number
		max:number
		genero:string
		__v:number
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
		activities?:Array<crud.activity>
		physics?:Array<crud.physics>
		discapacityLevel?:number
		history?:Array<crud.historys>
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
	interface LineChart{
		id:string
		config:any
	}
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
    	routeParams ?: {
				id:string
			}
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
	interface ErrorMatter{
		dni?:boolean
		name?:boolean
		phone?:boolean
		email?:boolean
		birthdate?:boolean
		server?:codeError
	}
	interface MatterItem{
		matter:crud.courses
		session:users.sessions
		delete:Function
	}
	interface MatterView{
		routeParams:{
			id:string
		}
	}
	interface StudentCreate{
		routeParams:{
			id:string
		}
		router:ReactRouter.InjectedRouter
	}
	interface StudentView{
		routeParams:{
			id:string
		}
		router:ReactRouter.InjectedRouter
	}
	interface StudentTable {
		delete:Function
		students:Array<peoples.students>
		session:users.sessions
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
	interface MatterCreate{
		error: any
	}
	interface TeacherView {
		teacher:peoples.teachers
		error:string
		grades:Array<crud.grade>
		activities:Array<crud.activity>
	}
	interface MatterList{
		matters:Array<crud.courses>
	}
	interface MatterView{
		matter:crud.courses
	}
	interface StudentList{
		students:Array<peoples.students>
		search:string
	}
	interface StudentCreate{
		error:any
	}
	interface StudentView{
		student:peoples.students
		error:any
		grades:Array<crud.grade>
		weights:Array<crud.weights>
		heights:Array<crud.heights>
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
	interface student{
		name:validator
		birthdate:validator
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
		interface Matter{
			name:string
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
interface ValidInput{
	name:string
	label:string
	value:string
}
/*
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
*/

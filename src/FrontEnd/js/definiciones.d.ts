interface Window{
	settings:any
	validator:any
	Promise:{
		all:any
		race:any
	}
  _BASE: string
}
declare let validator: any;
declare let componentHandler: any;
declare let APP: any;

/*
  People
*/
declare namespace People {
  interface people{
		_id:string
		dni:string
		name:string
		birthdate:string
		mode:string
		createDate:string
    tel: string
    genero: string
		_v:number
	}
  interface teacher{
		_id:string
		data:people
		interprete:boolean
		grade?: CRUD.grade
		_v:number
	}
	interface student{
		_id:string
		_v:number
		data:people
		grade?: CRUD.grade
		activities?:Array<CRUD.activity>
		physics?:Array<CRUD.physic>
		discapacityLevel?:number
		history?:Array<CRUD.history>
	}
	interface parent{
		_id:string
		data:people
		_v:number
		students?: Array<student>
	}
}
/*
  User
*/
declare namespace User {
  interface profile{
		_id:string
		username:string
		password?:string
		_v:number
		isAdmin:boolean
		dateCreated:string
		people:People.people
		email:string
	}
	interface session{
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
  interface sessions{
    sessions: Array<session>
  }
}
/*
  Obj
*/
declare namespace Obj {
  interface session {
    session: User.session
  }
  interface teacher {
    teacher: People.teacher
  }
}
/*
Card
*/
declare namespace Card {
  interface teacher{
    teacher: People.teacher
    session: User.session
    delete ?: Function
  }
  interface student{
    student: People.student
    session: User.session
    delete ?: Function
    activity ?: string
  }
  interface parent{
    parent: People.parent
    session: User.session
    delete: Function
  }
  interface grade{
    grade: CRUD.grade
    session: User.session
    delete: Function
  }
  interface matter{
    matter: CRUD.course
    session: User.session
    delete: Function
  }
  interface domain{
    domain: CRUD.domain
    session: User.session
  }
  interface level{
    level: CRUD.level
    session: User.session
    domain: string
  }
  interface objetive{
    objetive: CRUD.objetive
    session: User.session
    delete: Function
    domain?: string
    level?: string
    activity?: string
  }
  interface cognition{
    cognition: CRUD.cognition
    session: User.session
    delete: Function
    domain: string
    level: string
  }
  interface activity{
    activity: CRUD.activity
    session: User.session
    delete: Function
  }
}

/*
Props
*/
declare namespace Props {
  interface teacherView {
    routeParams: {
      id: string
    }
    router:ReactRouter.InjectedRouter
  }
  interface objetiveView {
    routeParams: {
      id: string
      domain:string
      level: string
    }
    router:ReactRouter.InjectedRouter
  }
  interface GenericRouter{
		router?:ReactRouter.InjectedRouter
		routeParams?: any
    location:ReactRouter.LocationDescriptor
	}
  interface LineChart{
		id:string
		config:any
	}
}
/*
  State
*/
declare namespace State {
  interface teacherEdit {
    teacher: People.teacher
    error: any
    grades: Array<CRUD.grade>
  }
}

declare namespace CRUD{
  interface codeError{
  	code:string
  	message:string
  }

	interface physic{
		height: number
		weight:number
		age: number
		_id: string
		date:string
	}
	interface history{
		_id:string
		description:string
		dateCreated: string
	}
	interface grade{
		_id:string
		_v:number
		name:string
	}
	interface course{
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
		description:string
		_v:number
		levels: Array<level>
		cognitions:Array<cognition>
	}
	interface level{
		_id:string
		name:string
		description:string
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
      level: level
      domain: domain
  	}
	interface activity{
		name: string
  		description: string
  		dateExpire:string
  		teacher: string
		grade:grade
		course: grade
  		_id: string
  		students: Array<People.student>
  		dateCreated: string
  		isCompleted: Boolean
  		objetives: Array<objetive>
	}
	interface weight{
		_id:string
		height:number
		min:number
		max:number
		genero:string
		__v:number
	}
	interface height{
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


/*
declare namespace Props{

	interface UserLogin {
		location:ReactRouter.LocationDescriptor
		router:ReactRouter.InjectedRouter
	}
	interface menu{
    	router?:ReactRouter.InjectedRouter
	}
	interface profilebox{
    	router?:ReactRouter.InjectedRouter
    	callback:Function
    	session:User.session
	}
	interface tableteacher{
		teachers:Array<People.teacher>
		session?:User.session
		delete:Function
	}
	interface tableaddobjetive{
		objetives:Array<CRUD.objetive>
		session?:User.session
		callback:Function
		activity:string
	}
	interface tableaddstudent{
		students:Array<People.student>
		session?:User.session
		callback:Function
		activity:string
	}
	interface tableaddcognitions{
		cognitions:Array<CRUD.cognition>
		session?:User.session
		callback:Function
		objetive:string
		domain:string
		level:string
	}
	interface tableactivities{
		activities:Array<CRUD.activity>
		delete:Function
		session:User.session
	}
	interface teacherItem{
		people?:People.teacher
		delete?:Function
		session?:User.session
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
		[k:string] :  | Array<CRUD.grade>
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
		server?:CRUD.codeError
	}
	interface MatterItem{
		matter:CRUD.courses
		session:User.session
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
		students:Array<People.student>
		session:User.session
	}
	interface ParentTable {
		delete:Function
		parent:People.parent
		session:User.session
	}
	interface ItemUser {
		delete:Function
		user:User.profile
		session:User.session
	}
}

declare namespace states{
	interface menu{
		session: User.session
	}
	interface ListTeachers{
		teachers:Array<People.teacher>
		search:string
	}
	interface ListParent{
		parents:Array<People.parent>
		search:string
	}
	interface ViewParent{
		parent:People.parent
		error:any
	}
	interface SetCognitions{
		cognitions:Array<CRUD.cognition>
		error:any
	}
	interface TeacherCreate{
		error: any
		radio:string
	}
	interface MatterCreate{
		error: any
	}
	interface ObjetiveSelect{
		error: any
		domains:Array<CRUD.domain>
		levels:Array<CRUD.level>
		objetives:Array<CRUD.objetive>
		isAdd:boolean
	}
	interface TeacherView {
		teacher:People.teacher
		error:string
		grades:Array<CRUD.grade>
		activities:Array<CRUD.activity>
	}
	interface ActivityView {
		error:string
		grades:Array<CRUD.grade>
		activity:CRUD.activity
		objetives:Array<CRUD.objetive>
		sugessObjetive:Array<CRUD.objetive>
		students:Array<People.student>
	}
	interface MatterList{
		matters:Array<CRUD.courses>
		error?:any
	}
	interface MatterView{
		matter:CRUD.courses
	}
	interface StudentList{
		students:Array<People.student>
		search:string
	}
	interface DomainList{
		domains:Array<CRUD.domain>
		search:string
	}
	interface DomainView{
		domain:CRUD.domain
		error:any
	}
	interface StudentCreate{
		error:any
	}
	interface StudentView{
		student:People.student
		error:any
		grades:Array<CRUD.grade>
		weights:Array<CRUD.weights>
		heights:Array<CRUD.heights>
	}
	interface GradeList{
		grades:Array<CRUD.grade>
		students?:Array<People.student>
		error?:any
	}
	interface UserList{
		User:Array<User.profile>
		error?:any
	}
	interface UserView{
		user:User.profile
		error:any
		icon?:string
	}
	interface SessionLogin{
		user:User.session
		error:any
		icon?:string
	}
	interface GradeView{
		grade:CRUD.grade
		students:Array<People.student>
		error:any
	}
	interface DomainObjetiveView{
		objetives:Array<CRUD.objetive>
		error:any
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
		user:User.profile
	}
	interface teachersParams{
		id:string
	}
	interface teacherState{
		teacher?: People.teachers
		teachers?: Array<People.teachers>
		error?:errorState
		user?:compat.Map
	}
	interface fieldsTeachers{
		error:errorState,
		radio?:string
	}
	interface parentItem{
		people?:People.parents
		delete?:Function
		session?:User.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface studentsItem{
		people?:People.parents
		delete?:Function
		session?:User.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface UserItem{
		people?:User.profile
		delete?:Function
		session?:User.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
	interface basic{
		session?:User.sessions
    	routeParams ?: teachersParams
    	router?:ReactRouter.InjectedRouter
    	location?: any
    	children?: any
	}
*/

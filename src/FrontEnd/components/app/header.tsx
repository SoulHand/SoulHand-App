import * as React from 'react'

  interface PropHeadSimple {
    title ?: string
  }
  
  interface PropHeadFilter{
    title ?: string
    filter: any
    menu?: any
  }

  class Title extends React.Component <PropHeadSimple, {}>{
    render(){
     return (
       <span className="mdl-layout-title">SoulHand {(this.props.title) ? " - " + this.props.title : ''}</span>
     );
    }
  }

  export class Header extends React.Component<PropHeadSimple, {}>{
    render(){
      return (
        <header className="mdl-layout__header mdl-color-text--white">
          <div className="mdl-layout__header-row">
            <Title title={this.props.title}/>
            <div className="mdl-layout-spacer"></div>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
              <li className="mdl-menu__item" onClick={(e) => {
                window.history.pushState({}, null, "/#/license");
              }}>A cerca de</li>
              <li className="mdl-menu__item">Contacto</li>
              <li className="mdl-menu__item">Información legal</li>
            </ul>
          </div>
        </header>
      );
    }
 }
  export class HeaderSearch extends React.Component<PropHeadFilter, {}>{
   render(){
     return (
       <header className="mdl-layout__header mdl-color-text--white">
         <div className="mdl-layout__header-row">
           <Title title={this.props.title} />
           <div className="mdl-layout-spacer"></div>
           <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
             <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
               <i className="material-icons">search</i>
             </label>
             <div className="mdl-textfield__expandable-holder">
               <input className="mdl-textfield__input" type="text" id="search" onChange={(e) => { this.props.filter(e) }} />
               <label className="mdl-textfield__label" htmlFor="search">Ingrese su consulta...</label>
             </div>
           </div>
         </div>
       </header>
     );
   }
 }
  export class HeaderFree extends React.Component<{ menu?: any , title?: string}, {}>{
    render() {
      return (
        <header className="mdl-layout__header mdl-color-text--white">
          <div className="mdl-layout__drawer-button"><a href="javascript:void(0);" onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}><i className="material-icons">&#xE5C4;</i></a></div>
          <div className="mdl-layout__header-row">
            <Title title={this.props.title} />
            <div className="mdl-layout-spacer"></div>
            {this.props.menu}
          </div>
        </header>
      );
    }
  }
//React.MouseEvent<HTMLButtonElement>
 export class HeaderBack extends React.Component <{title ?: string, success: any, label?: string}, {}>{
   render(){
     return (
       <header className="mdl-layout__header mdl-color-text--white">
         <div className="mdl-layout__drawer-button"><a href="javascript:void(0);" onClick={(e) => {
           e.preventDefault();
           window.history.back();
        }}><i className="material-icons">&#xE5C4;</i></a></div>
        <div className="mdl-layout__header-row">
           <Title title={this.props.title} />
          <div className="mdl-layout-spacer"></div>
          <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" onClick={this.props.success} title={this.props.label}>
            <i className="material-icons">check</i>
          </button>
        </div>
       </header>
     );
   }
 }
 
export class HeaderTabSearch extends React.Component<PropHeadFilter, {}>{
   render(){
     return (
       <header className="mdl-layout__header mdl-color-text--white">
          <div className="mdl-layout__header-row">
              <Title title={this.props.title} />
              <div className="mdl-layout-spacer"></div>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
              <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
                <i className="material-icons">search</i>
              </label>
              <div className="mdl-textfield__expandable-holder">
                <input className="mdl-textfield__input" type="text" id="search" onChange={(e) => { this.props.filter(e) }} />
                <label className="mdl-textfield__label" htmlFor="search">Ingrese su consulta...</label>
              </div>
            </div>
          </div>
          <div className="mdl-layout__tab-bar mdl-js-ripple-effect">
            {this.props.menu}
          </div>
        </header>
     );
   }
 }
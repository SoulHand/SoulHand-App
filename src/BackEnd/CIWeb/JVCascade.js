(function(Global){
	if(!Global.Matrix){
		throw new Error("Este objeto requiere la librería Matrix para continuar!");
	}
	Global.JVCascade={
		Weak:function(input,weight,scale,T){
			var sum=0,m=weight.length;
			if(isNaN(T)){
				T=1;
			}
			for(var i=0;i<m;i++){
				var h=Matrix.inmultiply(input,weight[i]);
				sum+=h*scale[i];
			}
			max=MFunction.Sigmoidea(sum);
			return Math.abs(T-Math.round(max))==0;
		},
		Strong:function(input,CASCADE,SCALES,T){			
			for(var i=0,n=CASCADE.length;i<n;i++){
				if(!JVCascade.Weak(input,CASCADE[i],SCALES[i],T)){
					return false;
				}
			}
			return true;
		},		
	}
})(this);
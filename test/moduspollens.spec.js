var Inferences=require("../src/BackEnd/SoulHand/inferencia/inferences.js");

describe("Inferencias Modus Pollens",function(){
	var inferen=new Inferences("hola");
	it("IF A EQUAL \"hola\" THEN B IS \"saludo\"",function(){
		var A="hola",B;
		var premise=[
			{
				premise:"p1==\"hola\"",
				consecuent:"q1='saludo'",
			}
		];
		var consecuents=inferen.ModusPones(premise,{
			p1:A
		});
		expect(consecuents[0].q1).toBe("saludo");
	});
	it("IF A EQUAL NOT \"hola\" THEN B IS \"saludo\"",function(){
		var A="hola",B;
		var premise=[
			{
				premise:"p1!=\"hola\"",
				consecuent:"q1='saludo'",
			}
		];
		var consecuents=inferen.ModusPones(premise,{
			p1:A,
		});
		expect(consecuents.length).toBe(0);
	});
	it("IF A EQUAL \"hola\" OR A EQUAL 'adios' THEN B IS \"cortesia\"",function(){
		var A="hola",B;
		var premise=[
			{
				premise:"p1==\"hola\" || p1=='adios'",
				consecuent:"q1='cortesia'",
			}
		];
		var consecuents=inferen.ModusPones(premise,{
			p1:A
		});
		expect(consecuents.length).toBe(1);
		expect(consecuents[0].q1).toBe("cortesia");
	});
	it("cajero automatico premisas autorizado",function(){
		var A="hola",cajero={
			tarjeta:"verificada",
			fecha:"no expirada",
			NIP:"correcto",
			intentos:"no excedido",
			balance:"suficiente",
			limite:"no excedido"
		};
		var premise=[
			{
				premise:"p1=='verificada' && p2=='no expirada' && p3=='correcto' && p4=='no excedido' && p5=='suficiente' && p6=='no excedido'",
				consecuent:"q1=\"autorizado\"",
			},
			{
				premise:"p1=='no verificada'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p2=='expirada'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p3=='incorrecto'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p4=='excedido'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p5=='insuficiente'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p6=='excedido'",
				consecuent:"q1=\"no autorizado\"",
			}
		];
		var consecuents=inferen.ModusPones(premise,{
			p1:cajero.tarjeta,
			p2:cajero.fecha,
			p3:cajero.NIP,
			p4:cajero.intentos,
			p5:cajero.balance,
			p6:cajero.limite
		});
		expect(consecuents.length).toBe(1);
		expect(consecuents[0].q1).toBe("autorizado");
	});
	it("cajero automatico premisas expirado fecha y tarjeta invalida",function(){
		var A="hola",cajero={
			tarjeta:"no verificada",
			fecha:"expirada",
			NIP:"correcto",
			intentos:"no excedido",
			balance:"suficiente",
			limite:"no excedido"
		};
		var premise=[
			{
				premise:"p1=='verificada' && p2=='no expirada' && p3=='correcto' && p4=='no excedido' && p5=='suficiente' && p6=='no excedido'",
				consecuent:"q1=\"autorizado\"",
			},
			{
				premise:"p1=='no verificada'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p2=='expirada'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p3=='incorrecto'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p4=='excedido'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p5=='insuficiente'",
				consecuent:"q1=\"no autorizado\"",
			},
			{
				premise:"p6=='excedido'",
				consecuent:"q1=\"no autorizado\"",
			}
		];
		var consecuents=inferen.ModusPones(premise,{
			p1:cajero.tarjeta,
			p2:cajero.fecha,
			p3:cajero.NIP,
			p4:cajero.intentos,
			p5:cajero.balance,
			p6:cajero.limite
		});
		expect(consecuents.length).toBe(2);
		expect(consecuents[0].q1).toBe("no autorizado");
		expect(consecuents[1].q1).toBe("no autorizado");
	});
	it("Reconocimiento-accion",function(){
		var premises=[
			{
				premise:"p1==\"no-hay\" && p2 == \"buenos\"",
				consecuent:"q1='prioridad'",
				h:1
			},
			{
				premise:"p1==\"no-hay\" && p2 == \"malos\"",
				consecuent:"q1='normal'",
				h:0.5
			},
			{
				premise:"p1==\"no-hay\" && p2 == \"malos\" && p3>10",
				consecuent:"q1='prioridad'",
				h:0.85
			}
		];
		var results=inferen.propagation(premises,[
			{
				p1:"no-hay",
				p2:"malos",
				p3:22
			},
			{
				p1:"no-hay",
				p2:"malos",
				p3:9
			}
		]);
		expect(results.length).toBe(2);
		expect(results[0].q1).toBe("prioridad");
		expect(results[1].q1).toBe("normal");
	});
});
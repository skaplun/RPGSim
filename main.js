
let fightLine = {

	attack : function(entity, type){
		
		if(type === 'enemy'){
			return 	"you attack the " + entity;		
		}else{
			return 	entity + " attacks you ";		
		}
	}, 
	
	attackRegion : function(dmgType, region, type){
		
		if(type === 'enemy'){
			return "attempting to " + dmgType + " their " + region;
		}else{
			return "attempting to " + dmgType + " your " + region;			
		}
		
	}, 
	
	counterAttack : function(entity, type, success, counterType){
		
		if(success){
			if(type === 'enemy'){
				return 'the ' + entity + ' successfully ' + counterType;
			}else{
				return 'you successfully ' + counterType;
			}
			
		}else{
			if(type === 'enemy'){
				return entity + ' failed to counter';
			}else{
				return 'you failed to counter';
				
			}
			
		}

	}, 
	
	result : function(entity, type, success, dmgType, subregion, dmg){
		
		if(success){
			if(type === 'enemy'){
				return 'you managed to ' + dmgType + ' their ' + subregion +  ' doing ' + dmg + ' damage';
			}else{
				return entity + ' managed to ' + dmgType + ' your ' + subregion +  ' doing ' + dmg + ' damage';
			}
			
		}else{
			if(type === 'enemy'){
				return 'you failed to hit your enemy';
			}else{
				return entity + ' failed to hit you';
				
			}
			
		}
		
	}, 
	
	final : function(entity, type, success, subregion, isDead){
		
		if(!success) return ' ';
		
			
		if(isDead){
			
			if(type === 'enemy'){
				return 'you believe you damaged their ' + subregion + ', killing them';
			}else{
				return entity + ' damaged your ' + subregion + ', killing you';
			}
		}else{
			if(type === 'enemy'){
				return 'you believe you damaged their ' + subregion;
			}else{
				return entity + ' damaged your ' + subregion;
			}
			
		}
					
	}, 
	
	sequence : function(entity, type, dmgType, region, subregion, dmg, counterType, counterSuccess, attackSuccess, isDead){
		return this.attack(entity, type) + ', ' + 
		this.attackRegion(dmgType, region, type) + ', ' + 
		this.counterAttack(entity, type, counterSuccess, counterType) + ', ' + 
		this.result(entity, type, attackSuccess, dmgType, subregion, dmg) + ', ' + this.final(entity, type, attackSuccess, subregion, isDead);
	},
	
	log : function(entity, type, dmgType, region, subregion, dmg, counterType, counterSuccess, attackSuccess, isDead){
		let seq = this.sequence(entity, type, dmgType, region, subregion, dmg, counterType, counterSuccess, attackSuccess, isDead);
		
		let div = document.createElement('DIV')
		div.className = 'fight-row';
		div.textContent = seq;
		if(type === 'enemy'){
			div.style.color = 'red'
		}else{
			div.style.color = 'cyan'
		
		}
		document.getElementById('fight-container').prepend(div);
		
	}

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function removeActive(selector){
	document?.querySelector(selector)?.querySelector('.active')?.classList.remove('active')
}

let calculator = function(playerObj, enemyObj, enemyName, defender){
	
	let player;
	let enemy;
	let bodyRegion;
	let bodySubregion;
	let dmgAmount;
	let counterSuccessChance;
	let attackSuccessChance;
	let attackDirection;
	
	function dmgType(){
		let dmgTypes = ['stab', 'jab', 'swing at', 'poke', 'bludgeon'];
		return dmgTypes[Math.floor(Math.random() * dmgTypes.length)];
	}
	
	function region(playerIsAttacked){
		//monster attacks random region, if player doesn't set direction attack random region
		if(playerIsAttacked || !fightEngine.attackDirection){
			let bodyPartsArray = Object.keys(playerIsAttacked ? player.body : enemy.body);
			
			bodyRegion  = bodyPartsArray[Math.floor(Math.random() * bodyPartsArray.length)];
			return bodyRegion;
			
		}else{
			//player attacks based on player choice
			attackDirection = fightEngine.attackDirection.split('attack-')[1];
			let directions = {
				'top-right' : ['head', 'chest', 'right-shoulder', 'right-hand'],
				'top' : ['head', 'chest', 'right-shoulder', 'left-shoulder'],
				'top-left' : ['head', 'chest', 'left-shoulder', 'left-hand'],
				'left' : ['chest', 'stomach', 'left-shoulder', 'left-hand'],
				'right' : ['chest', 'stomach', 'right-shoulder', 'right-hand'],
				'bottom-left' : ['stomach', 'left-hand', 'left-leg', 'left-foot'],
				'bottom' :  [ 'stomach', 'left-leg', 'right-leg', 'left-hand', 'right-hand'],
				'bottom-right' : [ 'stomach', 'right-hand', 'right-leg', 'right-foot'],
			}
			
			let possibleRegions = directions[attackDirection];
			
			bodyRegion = possibleRegions[Math.floor(Math.random() * possibleRegions.length)];
			return bodyRegion;
		}
		
	}
	
	function subregion(playerIsAttacked){
		let organsArray = Object.keys(playerIsAttacked ? player.body[bodyRegion].organs : enemy.body[bodyRegion].organs);
		
		bodySubregion = organsArray[Math.floor(Math.random() * organsArray.length)];
		return bodySubregion;
	}
	
	function dmg(){
		dmgAmount = getRandomInt(10, 25);
		return dmgAmount;
		
	}
	
	function counterType(){
		
		let counters = ['dodge', 'block', 'parry', 'riposte'];
		return counters[Math.floor(Math.random() * counters.length)];
		
	}
	
	function counterSuccess(playerIsAttacked){
	
		if(playerIsAttacked || !fightEngine.defenseDirection){
			let successChance = Math.random();
			counterSuccessChance = successChance > 0.7 ? true : false;
			return counterSuccessChance	
		}else{
			let direction = fightEngine.defenseDirection.split('defense-')[1];
			let directions = {
				'top' : ['top-right', 'top', 'top-left'],
				'left' : ['top-left', 'left', 'bottom-left'],
				'right' : ['top-right', 'right', 'top-left'],
				'bottom' :  ['bottom-right', 'bottom', 'bottom-left'],
				'center' : [ 'top', 'left', 'right', 'bottom'],
			}
			let defendedAreas = directions[direction];
			if(defendedAreas.includes(attackDirection)){
				return true
			}else{
				let successChance = Math.random();
				counterSuccessChance = successChance > 0.4 ? true : false;
				return counterSuccessChance	
			
			}
		
		}
		
	}
	
	function attackSuccess(){
		if(counterSuccessChance)
			return false;
		
		let successChance = Math.random();
		attackSuccessChance = successChance > 0.2 ? true : false;
		return attackSuccessChance
	}
	
	function isDead(playerIsAttacked){
		if(counterSuccessChance || !attackSuccessChance)
			return false;
		
		let damagedPerson = playerIsAttacked ? fightEngine.player : fightEngine.enemy;
		
		damagedPerson.body[bodyRegion].hp = damagedPerson.body[bodyRegion].hp - dmgAmount;
		
		fightEngine.drawBodies(playerIsAttacked, damagedPerson.body, bodyRegion)
		
		if(damagedPerson.body[bodyRegion].hp < 0){
			fightEngine.killed = true;
			return true;
			
		}else{
			return false;
		}
	}
	
	function isPlayerAttacked(defender){
		return defender === 'enemy' ? false : true;
	}
	
	function start(playerObj, enemyObj, enemyName, defender){
		
		player = playerObj;
		enemy = enemyObj;

		return [enemyName, defender, dmgType(), 
			 region(isPlayerAttacked(defender)), subregion(isPlayerAttacked(defender)), dmg(), 
			 counterType(), counterSuccess(isPlayerAttacked(defender)), attackSuccess(), isDead(isPlayerAttacked(defender))];			
	}
	
	return start(playerObj, enemyObj, enemyName, defender)
}

let fightEngine = {
	
	player : undefined,
	enemy : undefined,
	killed : false,
	attackDirection : undefined,
	defenseDirection : undefined,
	spell : undefined, 
	
	calculate : function(){
		return [calculator(this.player, this.enemy, 'thief', 'enemy'), calculator(this.player, this.enemy, 'thief', 'player')];
	},
	
	printFightRow : function(entity, type, dmgType, region, subregion, dmg, counterType, counterSuccess, attackSuccess, isDead){
		return fightLine.log(entity, type, dmgType, region, subregion, dmg, counterType, counterSuccess, attackSuccess, isDead)
	},
	
	endRound : function(){
	
		Array.from(document?.querySelectorAll('.active')).forEach(function(active){
			active.classList.remove('active')
		})
		
		this.attackDirection = undefined;
		this.defenseDirection = undefined;
		this.spell = undefined;
		
		if(this.killed)
			clearInterval(this.engine);
			
	},
	
	addLineSeperator : function(){
		document.getElementById('fight-container').prepend(document.createElement('BR'));
	},
	
	generateRound : function(fightRow1, fightRow2){
		this.printFightRow(...fightRow1);
		this.printFightRow(...fightRow2);
		
		this.addLineSeperator();		
		this.endRound();
	},
	
	beginFight : function(){
		this.engine = setInterval(function(){
			return this.generateRound(...this.calculate());
		}.bind(this), 5000);
	},
	
	drawBodies : function(playerIsAttacked, bodyObj, bodyRegion){
		let htmlBody =  document.querySelector(playerIsAttacked ? '#player' : '#enemy');
		let region = htmlBody.querySelector('.' + bodyRegion);
		let hp = bodyObj[bodyRegion].hp;
		
		
		if( 40 > hp && hp > 30){
			region.style.fill = '#f9a73e'
		}
		if( 30 > hp && hp > 20){
			region.style.fill = 'chocolate'
		}
		
		if( 20 > hp && hp > 10){
			region.style.fill = '#bf212f'
		}
		if( 10 > hp && hp > 0){
			region.style.fill = '#000'
		}
	
	},
	
	_highLight : function(selector, e){
		if(e.target.closest(selector)){
			if(e.target.parentElement.classList.contains('active')){
				selector === '.offensive-compass' ? fightEngine.attackDirection = undefined : fightEngine.defenseDirection = undefined;
				return removeActive(selector)
			}else{		
				//save direction to engine
				removeActive(selector)
				e.target.parentElement.classList.add('active')
				selector === '.offensive-compass' ? fightEngine.attackDirection = e.target.parentElement.id : fightEngine.defenseDirection = e.target.parentElement.id;
			}
		}
	},
	
	highLightButtons : function(e){
		
		if(e.target?.parentElement?.classList.contains('direction')){
				
			if(e.target.closest('.offensive-compass')){
				fightEngine._highLight('.offensive-compass', e)
			}
			
			if(e.target.closest('.defensive-compass')){
				fightEngine._highLight('.defensive-compass', e)
			}
				
		}
		
		if(e.target.parentElement.classList.contains('spells')){
			if(e.target.classList.contains('active')){
				removeActive('.spells')
			}else{
				removeActive('.spells')
				e.target.classList.add('active')
				fightEngine.spell = e.target.id
			
			}
			
		}
		
	},
	
	events : function(){
		document.body.addEventListener('click', function(e){
			this.highLightButtons(e);
			
		}.bind(this));
	},
	
	init : function(player, enemy){
		this.player = player;
		this.enemy = enemy;
		this.events();
		return this.beginFight();
	
	}

}




let entityGenerator = function(){
	
			
	return {
		
		body : {
			
			'head': {
				'name' : 'head',
				'hp' : 50,
				'organs' : {
					'skull' : {
						'effect' : ['bleed'],
						'death' : {
							canDie : true,
							chance : 0.6
						},
						'organs' : {
							'brain' : {
								'effect' : ['daze'],
								'death' : {
									canDie : true,
									chance : 0.9
								}
							}
						}
					},
					
					'eye-left' : {
						'effect' : ['blind'],
						'death' : {
									canDie : true,
									chance : 0.6
								}
					},
					'eye-right' : {
						'effect' : ['blind'],
						'death' : {
									canDie : true,
									chance : 0.6
								}
					},
					'ear-left' : {
						'effect' : ['minor-daze'],
						'death' : false
					},
					'ear-right' : {
						'effect' : ['minor-daze'],
						'death' : false
					},
					
					'nose' : {
						'effect' : ['minor-daze'],
						'death' : false
					}
					
					
				}
			},
			
			'chest': {
				name : 'chest',
				hp : 50,
				organs : {
					'ribcage' : {
						'effect' : ['slow', 'daze'],
						'death' : {
							canDie : true,
							chance : 0.4
						},
						'organs' : {
							
							'heart' : {
								'effect' : ['stun'],
								'death' : {
									canDie : true,
									chance : 1
								},
							},
							'lungs' : {
								'effect' : ['stun', 'daze'],
								'death' : {
									canDie : true,
									chance : 0.8
								},
							},
						}
					},
					
					'spine' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
				}
			},
			
			'stomach': {
				name : 'abdomen',
				hp : 50,
				organs : {
					
					'spine' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					},
					'gut' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					},
					'intenstines' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					},
					'liver' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					},
					'kidney-right' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					},
					'kidney-left' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
				}
			},
			
			'left-shoulder': {
				name : 'thighs',
				hp : 50,
				organs : {
					
					'arteries' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'right-shoulder': {
				name : 'knees',
				hp : 50,
				organs : {
					
					'arteries' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'left-arm': {
				name : 'left arm',
				hp : 50,
				organs : {
					
					'arteries' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'right-arm': {
				name : 'right arm',
				hp : 50,
				organs : {
					
					'arteries' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'left-leg': {
				name : 'left leg',
				hp : 50,
				organs : {
					
					'arteries' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
		
			'right-leg': {
				name : 'right leg',
				hp : 50,
				organs : {
					
					'arteries' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'left-hand': {
				name : 'left hand',
				hp : 50,
				organs : {
					
					'fingers' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'right-hand': {
				name : 'right hand',
				hp : 50,
				organs : {
					
					'fingers' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},

			'left-foot': {
				name : 'left foot',
				hp : 50,
				organs : {
					
					'toes' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
			'right-foot': {
				name : 'right foot',
				hp : 50,
				organs : {
					
					'toes' : {
						'effect' : ['slow'],
						'death' : {
							canDie : true,
							chance : 0.4
						}
					}
					
					
				}
			},
			
				
		},
		
		skill : {
			
			offensive : {
				swingHigh : 100,
				swingLow : 100,
				jabCenter : 100,
				jabBottom : 100,
			},
			
			defensive : {
				deflectHigh : 200,
				deflectLow : 200,
				riposteCenter : 100,
				riposteBottom : 100
			}
			
		},
		
		stats : {
			
			mana : 100,
			intellect : 100,
			fortitude : 100,
			
			
		}

	}
	
}

document.addEventListener('DOMContentLoaded', function(){
	
	
	fightEngine.init(entityGenerator(), entityGenerator())
	
})




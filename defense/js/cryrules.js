console.log("rules 17");
function ruleBaseTowerPrice() {
	return 20;
}
function ruleUpgradeTowerPrice(levelId) {
	var r = 0;
	switch (levelId) {
	case 0:
		r = 150;
		break;
	case 1:
		r = 700;
		break;
	default:
		r = 2100;
		break;
	}
	return r;
}
function ruleSellTower1() {
	return ruleBaseTowerPrice() * 0.9;
}
function ruleSellTower2() {
	return (ruleBaseTowerPrice() + ruleUpgradeTowerPrice(0)) * 0.9;
}
function ruleSellTower3() {
	return (ruleBaseTowerPrice() + ruleUpgradeTowerPrice(0) + ruleUpgradeTowerPrice(1)) * 0.9;
}
function ruleSellTower4() {
	return (ruleBaseTowerPrice() + ruleUpgradeTowerPrice(0) + ruleUpgradeTowerPrice(1) + ruleUpgradeTowerPrice(2)) * 0.9;
}
function ruleTowerStrikeDistance(levelId) {
	var r = 0;
	switch (levelId) {
	case 0:
		r = 4;
		break;
	case 1:
		r = 4;
		break;
	case 2:
		r = 5;
		break;
	default:
		r = 6;
	}
	return r;
}
function ruleEffectSeed() { //0-1
	return 0.1;
}
function ruleStrikePower(colorId, towerColor, levelId) {
	var r = 0;
	var colorRatio = 0.001;
	if (towerColor == colorId) {
		colorRatio = 1;
	}
	switch (levelId) {
	case 0:
		r = 40;
		break;
	case 1:
		r = 75;
		break;
	case 2:
		r = 200;
		break;
	case 3:
		r = 500;
		break;
	default:
		r = 1300;
	}
	return r * colorRatio;
}
function ruleEffectPowerRed(levelId) {
	
	return ruleStrikePower(0, 0, levelId) * 0.1;
}
function ruleEffectPowerGreen(levelId) {
	
	return ruleStrikePower(0, 0, levelId) * 0.025;
}
function ruleEffectPowerBlue(levelId) {
	return 0;
}
function ruleWaveColorIndex(cntr) {
	return cntr % 4;
}
function ruleWavePower(cntr) {

	var r= (1+Math.floor( cntr / 4)) * 75; 
	return r;
}
function ruleWaveLength(cntr) {

	var r = 3 + Math.floor(cntr / 4);
	
	return r;
}
function ruleLivesStart() {
	return 10;
}
function ruleMoneyStart() {
	return 200;
}
function ruleEnemyPrize(cntr) {
	
	var str = ruleWavePower(cntr);
	
	var r = 20+Math.floor(5*cntr/ruleWaveLength(cntr));
	
	return r;
}
function ruleFrameDelay() {
	return 1000 / 30;
}
function ruleTowerRotationSpeed1() {
	return 0.03;
}
function ruleTowerRotationSpeed2() {
	return 0.1;
}
function ruleTowerRotationSpeed3() {
	return 0.2;
}
function ruleTowerRotationSpeed4() {
	return 0.2;
}
function ruleEnemyStepSize() {
	return 0.2;
}
function ruleDeadStepSize() {
	return 0.05;
}
function ruleBubbleStepSize() {
	return 0.1;
}
function ruleSleepDuration1() {
	return 70;
}
function ruleFireDuration1() {
	return 20;
}
function ruleSleepDuration2() {
	return 10;
}
function ruleFireDuration2() {
	return 30;
}
function ruleSleepDuration3() {
	return 1;
}
function ruleFireDuration3() {
	return 50;
}
function ruleSleepDuration4() {
	return 20;
}
function ruleFireDuration4() {
	return 20;
}
function ruleEffectDuration() {
	return 100;
}

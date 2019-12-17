
import _ from 'lodash';
import {name} from '@/ll'
import './style/one.css' // 引入样式
import './style/index.scss' // 引入样式
function createElement(){
	let div = document.createElement('div');
	div.innerHTML = _.join(['无法抗拒','问问维特娃','i违法s',name],'');
	div.className = "box";
	return div;
}
document.body.appendChild(createElement());
console.log(123)
console.log(456)
console.log(7891010)

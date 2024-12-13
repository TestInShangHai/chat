
//生产测试切换
let isPro = true;

let baiduAk = 'rFHIHVzGlStyRQ5r4Cj34ak8QtGLpIju'
let uatDatailUrl = 'http://rp.keyload.ink:8093/detail.html?&iswebsite=true&id='
// let uatDatailUrl = 'http://10.1.137.251:8848/spring-boot-demo/src/main/webapp/dexin_h5_app/detail.html?iswebsite=true&id='
let proDatailUrl = 'https://h5.dexin-design.com/detail.html?&iswebsite=true&id='
let apkDownloadUrl = 'https://admin.dexin-design.com/app-dexin.apk'
let iOSDownloadUrl = 'itms-apps://itunes.apple.com/app/id1665883694'
let uatQRCodeUrl = "http://rp.keyload.ink:8086/"
let proQRCodeUrl = "https://dexin-design.com/"


let userAgent = navigator.userAgent;
/**
 *  是否是iOS打开
 * @returns 
 */
function isiOS() {
	return !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}
/**
 * 
 * @returns 是否是Android打开
 */
function isAndroid() {
	return userAgent.indexOf('Android') > -1 ||
		userAgent.indexOf('android') > -1 ||
		userAgent.indexOf('Adr') > -1 ||
		userAgent.indexOf('adr') > -1;
}
/**
 * 
 * @returns 是否是手机
 */
function isMobile() {
	return isAndroid() || isiOS();
}

/**
 * 是否是QQ微信打开
 */
function isWeChatOrQQ() {
	const ua = userAgent.toLowerCase()
	if (ua.indexOf('micromessenger') > -1) {
		// 如果是微信
		return true
	} else if (/mqqbrowser[\S|\s]*qq/.test(ua) || / qq/.test(ua)) {
		// 如果是QQ
		return true
	}
	return false
}

/**
 * 获取详情URL
 * @returns  url
 */
function getDetailUrl() {
	if (isPro) {
		return proDatailUrl;
	}
	return uatDatailUrl;
}

/**
 * 获取生成的二维码URL
 * @returns  url
 */
function getQRcodeUrl() {
	if (isPro) {
		return proQRCodeUrl;
	}
	return uatQRCodeUrl;
}
/**
 * 初始化
 */
function init() {
	initCss();
	initBaiduAK();
}

/**
 * 初始化百度地图ak
 */
function initBaiduAK() {
	let js = 'http://api.map.baidu.com/api?v=3.0&ak=' + baiduAk;
	if (isPro) {
		js = 'https://api.map.baidu.com/api?v=3.0&ak=' + baiduAk;
	}
	let baiduJs = '<script src="' + js + '"></script>';
	console.log('加载的百度地图', baiduJs)
	document.write(baiduJs);
}

/**
 * 初始化差异性的CSS
 */
function initCss() {
	let cssFile = 'css/pc.css';
	if (isAndroid() || isiOS()) {
		cssFile = 'css/mobile.css';
	}
	let css = '<link rel="stylesheet" type="text/css" href="' + cssFile + '"/>';
	console.log('加载的CSS', css)
	document.write(css);
}



/**
 * 显示加载框
 * @param {*} msg 提示信息 
 */
function showLoading(msg = '请稍等...') {
	vant.Toast.loading({
		message: msg,
		forbidClick: true,
		loadingType: 'spinner',
		duration: 0
	});
}

/**
 * 下载文件
 * @param {*} url  文件url
 */
function downloadFile(url) {
	console.log('下载文件');
	axios({
		url: url,
		method: 'GET',
		responseType: 'blob',
	}).then((response) => {
		var fileURL = window.URL.createObjectURL(new Blob([response.data]));
		var fileLink = document.createElement('a');

		fileLink.href = fileURL;
		let fileName = url.substring(name.lastIndexOf('/') + 1);
		fileLink.setAttribute('download', fileName);
		document.body.appendChild(fileLink);
		fileLink.click();
	});
}

/**
 *  网络请求，请求成功 resolve 直接返回 data数据
 * @param {Object} url  接口的值
 * @param {Object} param, 请求参数
 * @param {object} token token
 * @param {Object} method 方法类型  默认get
 * @returns res为服务器返回的数据包 res.data是数据 res.msg是提示信息 res.code 是状态码
 */
function request(url, param, method = 'get', showLoading = true) {
	if (showLoading) {
		vant.Toast.loading({
			message: '请稍等···',
			forbidClick: true,
			loadingType: 'spinner',
			duration: 0
		});
	}

	return new Promise((resolve, reject) => {
		axios({
			method: method,
			url: url,
			data: JSON.stringify(param),
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				'Authorization': ''
			}
		}).then(res => {
			vant.Toast.clear();
			console.log('响应数据', res.data)
			let msg = '服务器异常';
			if (typeof res.data !== 'object' || res.status != 200) {
				reject({ msg })
			} else if (res.data.code != '200') {
				if (res.data.msg) {
					msg = res.data.msg
				}
				reject(res.data)
			} else {
				resolve(res.data)
			}
		}).catch(error => {
			reject({ msg: '网络请求异常' });
			vant.Toast.clear();
		})
	});
}


/**
 *  阻止背景滚动
 * @param {*} flag   是否阻止背景滚动]
 */
function preventScoll(flag) {
	if (flag) {
		const top = document.documentElement.scrollTop || document.body.scrollTop;
		document.body.style.cssText += `
            position: fixed;
            width: 100vw;
            left: 0;
            top: ${-top}px;
        `
	} else {
		const top = document.body.style.top;
		document.body.style.cssText += `
            position: static;
        `;
		window.scrollTo(0, Math.abs(parseFloat(top)))
	}
}


/**
 * 格式刷时间日期
 * @param {*} date 日期 
 * @returns 
 */
function formatDate(date) {

	var dateString = new Date(date)
	// 注意js里面的getMonth是从0开始的
	let month = (dateString.getMonth() + 1);
	let day = dateString.getDate();
	let hours = dateString.getHours();
	let minutes = dateString.getMinutes();
	let seconds = dateString.getSeconds();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	if (hours < 10) hours = "0" + hours;
	if (minutes < 10) minutes = "0" + minutes;
	if (seconds < 10) seconds = "0" + seconds;

	let FormattedDateTime =
		dateString.getFullYear() + '-' +
		month + '-' +
		day + ' ' +
		hours + ':' +
		minutes + ':' +
		seconds
	return FormattedDateTime;
}
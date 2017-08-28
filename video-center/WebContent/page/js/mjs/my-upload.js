mui.init({
    pullRefresh:
        {
            container: '#pullrefresh',
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
});
mui.ready(function () {
	mui('body').on('tap','a',function(){
        window.top.location.href=this.href;
    });
    mui('#pullrefresh').pullRefresh().pullupLoading();
});
var count = 0;
/*
 * 上拉加载具体业务实现
 */
function pullupRefresh(){
    setTimeout(function() {
    	mui.ajax('/videoController.do?queryMyupload&pageNo='+count, {
        	type: 'POST',
        	headers:{
        		'token': mtools.getToken(),
        		'userId': mtools.getUserId()
        	},
        	processData: false,
        	contentType: false,
        	success: function(data){
        		if(mtools.isLogin() && data.status == '2000'){
        			var obj = data.obj;
            		if(obj.length==0){
            			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
            		}else{
            			var table = mtools.getEl('.mui-table-view');
            	        var cells = mtools.getEl('.mui-table-view-cell');

            	        for (var i = 0; i < obj.length; i++) {
            	            var li = document.createElement('li');
            	            li.className = 'mui-table-view-cell';
            	            li.innerHTML = '<div class="mui-card"><a href="play.html?thumbnailPath='+obj[i].thumbnailPath+'&fileName='+obj[i].fileName+'&id='+obj[i].id+'&last=my-upload.html">'+
            	                '<div class="mui-card-header mui-card-media">'+
            	            '<img onerror="this.src=\'./resource/404.png\'"  src="/fileController.do?readThumbnail&fileName='+obj[i].thumbnailPath+'">'+
            	            '<div class="mui-media-body">'+
            	            ' 小M'+
            	            ' <p>发表于 '+obj[i].crtTime+'   '+obj[i].playCount+'次播放</p>'+
            	            '</div>'+
            	            ' </div></a>'+
            	            '</div>';
            	            li.onclick = requestPlayPage();
            	            table.appendChild(li);
            	        }
            	        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
            	        count ++;
            		}
        		}
        	},
        	error: function(data){
        		mui.toast('请求我上传的视频异常，请稍后重试！');
        	}
        });
    }, 100);
}

function requestPlayPage(){
	
}

function showUpload () {
	if(mtools.isLogin()){
		mtools.getEl('#file_span').innerHTML = '<input type="file" name="file" style="display: none" id="input_file" onchange="handleFiles(this.files)">';
		mtools.getEl('#input_file').click();
	}
}

var _file = null;
function handleFiles(files){
	if(files.length == 1){
        _file = files[0];
        mtools.getEl('.upload-window').style.display = 'block';
    }
}
function uploadVideo(obj){
	if(_file == null || mtools.isEmpty(mtools.getEl('#title').value)){
		mui.toast('请补全信息');
	}else{
		var relSize = parseInt(_file.size/1024/1024); 
		if(relSize > 50){ // 大于10mb 
			mui.alert('视频超过50MB,您可使用视频压缩工具进行压缩处理！', '提示', function() {});
			return false; 
		} 
		// 查看视频类型 
		var tv_id =mtools.getEl('#input_file').value;//根据id得到值 
		var index= tv_id.indexOf("."); 
		tv_id=tv_id.substring(index).toLowerCase(); 
		/*if(tv_id!=".rb"&&tv_id!=".rmvb"&&tv_id!=".mp4"&&tv_id!=".flv"){ 
			mui.alert('不是指定视频格式,请重新选择!', '提示', function() {});
		    return false; 
		} */
		if(tv_id!=".mp4"){ 
			mui.alert('请上传MP4格式的视频,谢谢!', '提示', function() {});
		    return false; 
		} 
		var form = document.forms.namedItem("fileinfo");
		var formData = new FormData(form);
    	mui.ajax('/videoController.do?upload', {
        	type: 'POST',
        	headers:{
        		'token': mtools.getToken(),
        		'userId': mtools.getUserId(),
        		'userName': mtools.getUserName()
        	},
        	data:formData,
        	processData: false,
        	contentType: false,
    		beforeSend: function(data){
    			obj.setAttribute('disabled', 'disabled');
    			mui.toast('上传中');
    		},
        	success: function(data){
        		closeUploadWindow();
        		mtools.resetGoldCount();
        		mtools.getEl('.mui-table-view').innerHTML = '';
        		mui('#pullrefresh').pullRefresh().pullupLoading();
        	},
        	error: function(data){
        		mui.toast('系统异常，请稍后重试！');
        	}
        });
	}
}
function closeUploadWindow() {
	mtools.getEl('.upload-window').style.display = 'none';
}
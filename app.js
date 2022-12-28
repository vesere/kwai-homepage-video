const axios = require('axios')

const fs = require('fs')

let filePath = 'http://127.0.0.1:5501/ceshi.mp4'

let cookie = 'kpf=PC_WEB; kpn=KUAISHOU_VISION; clientid=3; client_key=65890b29; did=web_53be2bbf27357e691928269e84f402c3; didv=1666430874511; kuaishou.web.cp.api_st=ChZrdWFpc2hvdS53ZWIuY3AuYXBpLnN0EqABO6y0fz9ujXCqE36twtIqinXZhvFtVewFs00_qLJiP819c7QI_lU39DKFKnKBWg_0KCWnuGk1B02KMk8A-v16dxA4DDOGNPDTRedxS0nU-vWVLv4hfDelvhX41XZP5Ck7O9wX5aoiOuX85oDh3HTe118kVsqcL-bD88QoxZH5l3uLAxMbaBl8yLPmQwrwODvQlNLs9YdC0Nqa2zSiWvH7eRoSP67bVFjAYrLDKkZ-Dc4stgeaIiDH10Kfe3fjdVgdStIvrsoG8j8KgAvT0kS5VPtPdYXLdCgFMAE; kuaishou.web.cp.api_ph=065c68078697fd4f19f9a7d49f82e021e3d0; userId=546940635; kuaishou.server.web_st=ChZrdWFpc2hvdS5zZXJ2ZXIud2ViLnN0EqAB7BRHJZ83nSMrfwKulRzWkFy-lVaqHQFGeCAh2P_SK0SuWG1jkrdCuNOkl43Da0WwRexGPijV1eXX644A3pkDSUzq9E0EQ9h1BUC3vrGHl1B72UN1I2XBGEifmt5GH4gpvfB7S0r06qirxUihAsXB7fZonP_tfoCxyQ1vUUHLXtMnNw-ISsZXMRD7i70gb6xVrcc7ZadXygzJWB7dD-JJmhoStEyT9S95saEmiR8Dg-bb1DKRIiAH0aMRDJdok013EEiBZ5m8uuxjv6QCdB5VZ5tBQipa-igFMAE; kuaishou.server.web_ph=338692b251c65f0a45e6cc05526da454466e'

let userId = "3xwpfrup2mpach9"

let pcursor = ""

// 当没有视频时候返回的参数 pcursor
// no_more

let  variables = `{"userId": "${userId}","pcursor":"${pcursor}","page": "profile"}`
// console.log(variables);

let count = 0
let resultLength

dowload()

function dowload(){
    axios({
        method:'POST',
        url:'https://www.kuaishou.com/graphql',
        headers:{"Cookie":cookie,"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"},
        data:{query:"fragment photoContent on PhotoEntity {\n  id\n  duration\n  caption\n  originCaption\n  likeCount\n  viewCount\n  realLikeCount\n  coverUrl\n  photoUrl\n  photoH265Url\n  manifest\n  manifestH265\n  videoResource\n  coverUrls {\n    url\n    __typename\n  }\n  timestamp\n  expTag\n  animatedCoverUrl\n  distance\n  videoRatio\n  liked\n  stereoType\n  profileUserTopPhoto\n  musicBlocked\n  __typename\n}\n\nfragment feedContent on Feed {\n  type\n  author {\n    id\n    name\n    headerUrl\n    following\n    headerUrls {\n      url\n      __typename\n    }\n    __typename\n  }\n  photo {\n    ...photoContent\n    __typename\n  }\n  canAddComment\n  llsid\n  status\n  currentPcursor\n  tags {\n    type\n    name\n    __typename\n  }\n  __typename\n}\n\nquery visionProfilePhotoList($pcursor: String, $userId: String, $page: String, $webPageArea: String) {\n  visionProfilePhotoList(pcursor: $pcursor, userId: $userId, page: $page, webPageArea: $webPageArea) {\n    result\n    llsid\n    webPageArea\n    feeds {\n      ...feedContent\n      __typename\n    }\n    hostName\n    pcursor\n    __typename\n  }\n}\n",variables}
    }).then(val=>{
        // console.log('接口请求',val);
        let result = val.data.data.visionProfilePhotoList.feeds
        console.log('本次返回视频列表长度为---',result.length);
        resultLength = result.length
        pcursor = val.data.data.visionProfilePhotoList.pcursor
        console.log('下一页请求参数',pcursor);
        result.map((item,index)=>{

            // 判断文件名是否符合文件命名规范
            let fileName = item.photo.caption.replace(/[\\\\/:*?\"<>|]/g,'')
            setTimeout(()=>{
                wrmp4(item.photo.photoUrl,fileName)
            },Math.random()*10000)
            
            // 判断是否为最后一项
            if(index==result.length - 1){
                console.log('准备下一页');
            }
        })
    }).catch(err=>{
        console.log('错误信息',err);
    })
}




function wrmp4(url,title){
    axios.get(url,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"},responseType:'arraybuffer'}).then(val=>{
    let buf = val.data
    let file = Buffer.from(buf)

        // 异步api不能使用try catch捕获错误 要在回调
        fs.writeFile(`./小嫣/${title}.mp4`,file,(err)=>{
            count++
            console.log('写入完成--第'+count+'部');
            if(err){
                console.log('错误',err);
            }
            // 判断当count等于返回结果长度时进行请求下一页 并改变参数
            if(count == resultLength){
                variables = `{"userId":"${userId}","pcursor":"${pcursor}","page": "profile"}`
                console.log('准备下次请求执行dowm函数');
                console.log('请求参数为', variables);
                if(pcursor=='no_more'){
                    return console.log('----------主页视频已经采集完成---------');
                }
                dowload()
                console.log('正在执行本次请求---');
            }
        })
})
}

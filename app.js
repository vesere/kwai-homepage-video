const axios = require('axios')
const { log } = require('console')

const fs = require('fs')
const { cursorTo } = require('readline')

let filePath = 'http://127.0.0.1:5501/ceshi.mp4'

let cookie = 'kpf=PC_WEB; kpn=KUAISHOU_VISION; clientid=3; client_key=65890b29; did=web_53be2bbf27357e691928269e84f402c3; didv=1666430874511; userId=546940635; kuaishou.web.cp.api_st=ChZrdWFpc2hvdS53ZWIuY3AuYXBpLnN0EqABO6y0fz9ujXCqE36twtIqinXZhvFtVewFs00_qLJiP819c7QI_lU39DKFKnKBWg_0KCWnuGk1B02KMk8A-v16dxA4DDOGNPDTRedxS0nU-vWVLv4hfDelvhX41XZP5Ck7O9wX5aoiOuX85oDh3HTe118kVsqcL-bD88QoxZH5l3uLAxMbaBl8yLPmQwrwODvQlNLs9YdC0Nqa2zSiWvH7eRoSP67bVFjAYrLDKkZ-Dc4stgeaIiDH10Kfe3fjdVgdStIvrsoG8j8KgAvT0kS5VPtPdYXLdCgFMAE; kuaishou.web.cp.api_ph=065c68078697fd4f19f9a7d49f82e021e3d0; kuaishou.server.web_st=ChZrdWFpc2hvdS5zZXJ2ZXIud2ViLnN0EqABYFFiMOwo-rceLAIHyV7PU05L7dOuVIa2R6JhthEfHb9xTeFLm1PhluotdOHYbwbHRByE43K1OFK6JTbWHKdf5pCeiYFLynRYYasKhEKcOxjCvfr5dYi3bBjcn3gRbdgwWMnYFz-3B1RVrawvfaQM3ypC2py9Go03IadPaRG4CZaJEmdWuDGnNK-SoOO0CFscSXcG2WOPCMWXJnouf5MuLhoSoJCKbxHIWXjzVWap_gGna5KjIiBUxcCtEfKudDJvc-XCNdsMMrFZUgFxVex_ZI6yRmyjZCgFMAE; kuaishou.server.web_ph=73de8f2403d290df08ed8de19e06941851a1'

let pcursor = ""

let  variables = `{"userId": "3xkvt27kw2i6xbe","pcursor":"${pcursor}","page": "profile"}`

console.log(variables);

dowload()

function dowload(){
    axios({
        method:'POST',
        url:'https://www.kuaishou.com/graphql',
        headers:{"Cookie":cookie},
        data:{query:"fragment photoContent on PhotoEntity {\n  id\n  duration\n  caption\n  originCaption\n  likeCount\n  viewCount\n  realLikeCount\n  coverUrl\n  photoUrl\n  photoH265Url\n  manifest\n  manifestH265\n  videoResource\n  coverUrls {\n    url\n    __typename\n  }\n  timestamp\n  expTag\n  animatedCoverUrl\n  distance\n  videoRatio\n  liked\n  stereoType\n  profileUserTopPhoto\n  musicBlocked\n  __typename\n}\n\nfragment feedContent on Feed {\n  type\n  author {\n    id\n    name\n    headerUrl\n    following\n    headerUrls {\n      url\n      __typename\n    }\n    __typename\n  }\n  photo {\n    ...photoContent\n    __typename\n  }\n  canAddComment\n  llsid\n  status\n  currentPcursor\n  tags {\n    type\n    name\n    __typename\n  }\n  __typename\n}\n\nquery visionProfilePhotoList($pcursor: String, $userId: String, $page: String, $webPageArea: String) {\n  visionProfilePhotoList(pcursor: $pcursor, userId: $userId, page: $page, webPageArea: $webPageArea) {\n    result\n    llsid\n    webPageArea\n    feeds {\n      ...feedContent\n      __typename\n    }\n    hostName\n    pcursor\n    __typename\n  }\n}\n",variables}
    }).then(val=>{
        let result = val.data.data.visionProfilePhotoList.feeds
        pcursor = val.data.data.visionProfilePhotoList.pcursor
        variables = `{"userId": "3xkvt27kw2i6xbe","pcursor":"${pcursor}","page": "profile"}`
        result.map((item,index)=>{
            // console.log(item.photo.caption);
            // console.log(item.photo.photoUrl);
            if(index+1==result.length){
                console.log('下一页请求开始',variables);
             setTimeout(()=>{
                dowload()
             },Math.floor(Math.random()*10000))   
            }else {
                setTimeout(()=>{
                    wrmp4(item.photo.photoUrl,item.photo.caption+Math.random()*10)
                },Math.random()*400000)
            }
        })
    })
}




function wrmp4(url,title){
    axios.get(url,{responseType:'arraybuffer'}).then(val=>{
    let buf = val.data
    let file = Buffer.from(buf)

    fs.writeFile(`./${title}.mp4`,file,()=>{
        console.log('写入完成');
    })
})
}







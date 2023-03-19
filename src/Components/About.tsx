import { Container, Button, Textarea, Select, MultiSelect, Avatar,Image } from '@mantine/core';
import { MdOutlineArrowDownward } from "react-icons/md";

import React from 'react'


declare global {
    interface Window {
        talkColors: any
    }
}

const types = [
    {
        value: 'oneImage',
        label: '单图'
    },
    {
        value: 'left',
        label: '左侧对白',
        checked: true
    },
    {
        value: 'right',
        label: '右侧对白'
    },
    { value: 'talkClound', label: '群聊' },
    { value: 'inlineText', label: '内嵌' }
]

class Talks extends React.Component<{
    talkColors: any
}, {
    avatar: any,
    name: string,
    dialogue: string,
    names: any,
    type: string,
    result: string,
    drivingVideos: any
}>  {

    avatarInput: React.RefObject<unknown>;
    constructor(props: any) {
        super(props)
        this.state = {
            drivingVideos: [],
            avatar: localStorage.getItem('_avatar') || '',
            name: localStorage.getItem('_name') || '',
            names: JSON.parse(localStorage.getItem('names') || '[]'),
            dialogue: localStorage.getItem('_dialogue') || '',
            type: localStorage.getItem('_type') || '',
            result: ''
        }
        this.avatarInput = React.createRef();

    }

    componentDidMount() {
        this.getDrivingVideos().then((res:any)=>{
            this.setState({
                drivingVideos:res.data
            })
        })
    }


    async createImage(imgurl: string) {
        let im = document.createElement('img');
        return new Promise((res, rej) => {
            im.onload = () => {
                res(im)
            }
            im.src = imgurl;
        })
    }

    async oneImageLayout(name: string, imgurl: string, dialogue: string) {
        // 配色方案
        var colors = {
            font: 'rgb(181, 181, 181)',
            background: '#fff8ee',
            highlight: ['rgb(255, 192, 56)', 'rgb(181, 181, 181)']
        }

        let dt = new Date()
        let im = await this.createImage(imgurl)
        let color = [0, 0, 0]
        // console.log(color)
        return `<section class="mix-editor">
      <section class=""
          style="border: 1px dotted ${colors.highlight[1]}; 
          margin: 0 11px; 
          padding: 14px 19px 22px 18px; 
          box-sizing: border-box !important;">
          <section style="display: flex; flex-direction: column;">
              <section style="display: flex; justify-content: space-between;">
                  <section>
                      <p
                          style="color:rgb(${color.join(
            ','
        )}); font-size: 16px; font-weight: bold; line-height: 16px; font-family: '思源黑体'; letter-spacing: 1px; margin: 0">
                          ${name}</p>
                  </section>
                  <section>
                      <p
                          style="color: ${colors.highlight[1]
            }; font-size: 10px; line-height: 14px; font-family: '思源黑体'; letter-spacing: 1px; margin: 0">
                          ${dt.getFullYear()}.${dt.getMonth() +
            1}.${dt.getDate()}</p>
                  </section>
              </section>
              <section style="margin-top: 9px;">
                  <p
                      style="color: ${colors.highlight[1]
            }; font-size: 14px; line-height: 14px; font-family: '思源黑体'; letter-spacing: 1px; margin: 0">
                      I LOVE TO TRAVEL</p>
              </section>
              <section style="margin-top: 13px;"><img
                      style="max-width: 100%; width: 100%; display: block; height: auto;"
                      src="${imgurl}"
                      alt=""></section>
              <section
                  style="width: 61px;height: 6px;background-color: ${colors.background
            };text-align: right;align-self: flex-end;margin-top: 7px;">
              </section>
              <section style="display: flex;justify-content: space-between;align-items: center;margin-top: 17px;">
                   <p tyle="color: ${colors.highlight[1]}; 
                   font-size: 12px; line-height: 14px; 
                   font-family: '思源黑体'; 
                   letter-spacing: 1px; 
                   margin: 0">
                              ${dialogue}</p>
              </section>
          </section>
      </section>
  </section>`
    }


    oneImageLayout2(title: string, imgurl: string, description: string, isLeft = true) {
        let oImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAYAAABE4bxTAAADA0lEQVRYR8XXX0hTURwH8O/vbrubFQmBL2IvuZmC4EMP/YEebFtCUO/VSxBRUA89BCG5p0TIwB6C8qGHFf2hQEsKI92cUOhDpkFJ7s6sQASfpDJxu39+cTZXmvtz73bN87Kxnfs9n3vO72znElbaoKK2kYNfBWrlt9nPNuOV/oKSJ4joPkA9umGEWna7pzYVFIuxU69R4wB2AdAJ6AFwze+Tx/8n7M8MiUEjSuosCN2rAQwegCFdD9Q5o0TEG41bA+pPsFuGNgNwdY6BPxHhVpJd94746MdGwdaAxCDRROoiAzcKDLgIxkMQhQM+16jdsHWg2Bf26JqqANhZbDACpgAKS5r2uLmh4mux/ma+XwdK11IidRrAHTMB2T4MvCNQj6TrvYfqPWJzlNRygsSOM2rUCQYaS0oFJon4qcHUG/TJE1YycoIyO04NgnjASlievjMAXjJ40FiSIy1N9KtQZl6QuGgwofYR+JgNqGxEiog7/V53KF9mQVA0sVzLkD4AqLAR9Y1Bp4I+13CuzIKgTIGrrQB32AgSUQ8cSde55kZa/De3KGhsjF3fK9XxMgo8570wUyhY52q3DMrUUmofAW8AOGycqQUGrgR98u3VmUVnKNs5Op28ykxtNoIA0ByD21ejTIPE0i1UqqME7LEXhQVm6lre5uw6Wk1LpkHppVOSDUQ0BmCLzSiAEJYMdFsCZXZd8iQgDnL2N3HUsQxaKfKbBFywm0QMkWu9PfnI8g63GgNwwPrVea+YB9HxkkAisj/BVS6oIwR4bUERdwa87sslgwQiNr3sNVgaYaCqLBQhAjLOB2o9SlkggRhSUnsNwlAZO08hGJf8Ps9zkVc2KF3kcTVAEvdZR9EsMYf8dXI4O8O2gNI/B3H1ICR+AWC7yeVTQOgIeOW7Jf11mBkkklD3Azyyvi/NApggGJNgirOTx/Wf8udchzXbZihdT/FUkyHhvXjPwDQIEQIPG5r2+nD91jkzN2UrSDwcMHCGmHrh0J+JXWMGsZFL1urQtEflPBL9BktnFDZhBW8qAAAAAElFTkSuQmCC`
        // console.log(description)
        description = description.replace(/\n/gi, '<br>')

        if (isLeft) {
            return `<section class="mix-editor" style='margin: 2em 0;'>
              <section style="display: flex;">
                  <section style="display: inline-block;width: 56px;">
                      <section
                          style="width: 48px;height: 48px;overflow: hidden;border-radius: 50%;margin: 0px auto;text-align: center;box-sizing: border-box;">
                          <img src="${imgurl}" style="width: max-content; height: inherit; max-width: 100%;" class='mix-variable meta-human-avatar' variable-attribute='src'></section>
                      <p style="margin: 5px auto;color:#333;text-align:center;font-size: 10px;font-weight: 800;" class='mix-variable meta-human-name' variable-attribute='innerText'>${title}</p>
                  </section>
                  <section style="display: inline-block;">
                      <section
                          style="border-radius: 25px; background-color:rgb(239 239 239); padding: 15px; display: inline-block; color: rgb(17, 17, 17); margin-top: 13px; margin-left: 25px; box-sizing: border-box;">
                          <p style="margin: 0px;clear: none !important;font-size: 14px;font-weight: 300;" class='mix-variable meta-human-dialogue' variable-attribute='innerText'>${description}</p>
                      </section>
                  </section>
              </section>
          </section>`
        } else {
            return `<section class="mix-editor" style='margin: 2em 0;'>
              <section style="display: flex;justify-content: flex-end;">
      
                  <section style="display: inline-block;">
                      <section
                          style="border-radius: 25px; background-color:rgb(188, 219, 250); padding: 15px; display: inline-block; color: rgb(17, 17, 17); margin-top: 13px; margin-right: 25px; box-sizing: border-box;">
                          <p style="margin: 0px;clear: none !important;font-size: 14px;font-weight: 300;" class='mix-variable meta-human-dialogue' variable-attribute='innerText'>${description}</p>
                      </section>
                  </section>
      
                  <section style="display: inline-block;width: 56px;">
                      <section
                          style="width: 48px;height: 48px;overflow: hidden;border-radius: 50%;margin: 0px auto;text-align: center;box-sizing: border-box;">
                          <img src="${imgurl}" style="width: max-content; height: inherit;max-width: 100%;transform: rotateY(180deg) rotate(0deg);" class='mix-variable meta-human-avatar' variable-attribute='src'></section>
                      <p style="margin: 5px auto;color:#333;text-align:center;font-size: 10px;font-weight: 800;" class='mix-variable meta-human-name' variable-attribute='innerText'>${title}</p>
                  </section>
                  
              </section>
          </section>`
        }
    }

    // 头像嵌入文本
    inLineText(name: string, img: string, dialogue: string) {
        return `<section class="mix-editor" style="margin: 2em 0;">
         <section style="margin: 0 16px;">
             <p style="
             font-size: 10px;display: inline;"><img src="${img}" 
             style="width: 32px;height: auto;border-radius:100%;" 
             class="mix-variable meta-human-avatar" 
             variable-attribute="src"> </p>
             <p style="
             font-size: 10px;
             margin-right: 8px;display: inline;">${name}</p> 
             <p style="margin: 0px;clear: none !important;font-size: 14px;font-weight: 300;line-height: 28px;display: inline;" 
             class="mix-variable meta-human-dialogue" 
             variable-attribute="innerText">${dialogue}</p>
         </section>
     </section>`
    }


    talkMore(img: string, texts = []) {
        // let im= await Lab.ui.createImage(img);
        // let c=new Lab.Color();
        // let color=(await c.getColor(im))||[0,0,0];

        // console.log(texts)
        let isLeft = false
        let res = []
        for (const text of texts) {
            if (!window.talkColors || (window.talkColors && window.talkColors.length <= 0)) {
                window.talkColors = ['rgb(255 245 245)', 'rgb(246 255 245)', 'rgb(245 255 254)', 'rgb(247 245 255)', 'rgb(255 245 252)'];
            }
            let color = window.talkColors.pop();
            if (isLeft) {
                res.push(`<section class="mix-editor" style='margin:12px 0;'>
              <section style="display: flex;">
                  <section style="display: flex;
                  max-width: 60%!important;
                  justify-content: flex-start;">
                      ${texts.indexOf(text) >= texts.length - 2
                        ? `<p style='font-size:10px;color:rgb(212 212 212)'>#</p>`
                        : ''
                    }
                      <section
                          style="border-radius: 32px; background-color:${color}; padding: 10px 18px; display: inline-block; color: rgb(17, 17, 17);  margin-left: 25px; box-sizing: border-box;">
                          <p style="margin: 0px;clear: none !important;font-size: 14px;font-weight: 300;min-width: 112px;" class='mix-variable meta-human-dialogue' variable-attribute='innerText'>${text}</p>
                      </section>
                  </section>
              </section>
          </section>`)
                isLeft = false
            } else {
                res.push(`<section class="mix-editor" style='margin:12px 0;'>
                  <section style="display: flex;justify-content: flex-end;">
                      <section style="display: flex;
                      max-width: 60%!important;
                      justify-content: flex-end;">
                          <section
                              style="border-radius: 32px; background-color:${color}; padding: 10px 18px; display: inline-block; color: rgb(17, 17, 17);margin-right: 25px; box-sizing: border-box;">
                              <p style="margin: 0px;clear: none !important;font-size: 14px;font-weight: 300;min-width: 112px;" class='mix-variable meta-human-dialogue' variable-attribute='innerText'>${text}</p>
                          </section>
                          ${texts.indexOf(text) === 0
                        ? `<p style='font-size:10px;color:rgb(212 212 212)'>#</p>`
                        : ''
                    }
                      </section>
                  </section>
              </section>`)
                isLeft = true
            }
        }
        console.log(res)
        return res.join('')
    }

    async createBaseHtml(avatar: string, type: string, name = '昵称', dialogue = '对白') {
        let html = ''
        if (avatar) {
            if (type == 'oneImage') {
                html = await this.oneImageLayout(name, avatar, dialogue)
            } else if (type == 'left') {
                html = this.oneImageLayout2(name, avatar, dialogue)
            } else if (type == 'right') {
                html = this.oneImageLayout2(name, avatar, dialogue, false)
            } else if (type === 'inlineText') {
                html = this.inLineText(name, avatar, dialogue);
            }
        }
        if (type == 'talkClound') {
            let ds: any = dialogue.split('\n').filter(t => t)
            html = this.talkMore(avatar, ds)
        }

        return this.createCardByHtml(html)
    }


    createCardByHtml(html: string) {
        let htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = '<br>' + html + '<br>'
        htmlDiv.setAttribute('contenteditable', 'true')
        this.setState({
            result: htmlDiv.innerHTML
        })
        console.log(html)
        this.copy()
        return htmlDiv
    }

    updateAvatar(imgurl: any) {
        console.log('imgurl', imgurl)
        // this.setState({
        //     avatar: imgurl
        // })
    }

    updateName(name: any) {
        console.log(name)
        let t = name[0];
        this.setState({
            name: t
        })
        localStorage.setItem('_name', t)
    }

    updateDialogue(dialogue: any) {
        // console.log(dialogue)
        let t = dialogue.target.value;
        this.setState({
            dialogue: t
        })
        localStorage.setItem('_dialogue', t)
    }
    updateType(t: string) {
        console.log(t)
        this.setState({
            type: t
        })
        localStorage.setItem('_type', t)
    }

    async start() {
        let type = this.state.type;
        let avatar: string = this.state.avatar;
        let name: string = this.state.name;
        let dialogue: string = this.state.dialogue;
        console.log(this.state)
        if (type === 'left' || type === 'right') {
            await this.createBaseHtml(
                avatar,
                type,
                name,
                dialogue
            )
        } else if (type === 'oneImage') {
            await this.createBaseHtml(avatar, 'oneImage', name, dialogue)
        } else if (type === 'talkClound') {
            await this.createBaseHtml(avatar, 'talkClound', name, dialogue)
        } else if (type === 'inlineText') {
            await this.createBaseHtml(avatar, 'inlineText', name, dialogue)
        }
    }

    async readAvatar() {
        let url = await this.readText()
        this.writeClipImg(url)
    }

    async readText() {
        return await navigator.clipboard.readText()
    }
    async getClipboardContents() {
        let res = []
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    const blob = await clipboardItem.getType(type);
                    // console.log("已读取剪贴板中的内容：", await blob.text());
                    res.push(blob)
                }
            }
        } catch (err) {
            console.error("读取剪贴板内容失败: ", err);
        }
        return res
    }


    async loadImgBase64() {
        let files = await this.getClipboardContents();
        let isNew=false;
        for (const file of files) {
            // console.log(file)
            if (file.type.match('image')) {
                let base64: any = await this.blobToDataURI(file);
                this.setState({
                    avatar: base64
                })
                localStorage.setItem('_avatar', base64)
                this.createAvatarGif(base64);
                isNew=true;
                return base64
            }
        }
        if(isNew==false){
            this.createAvatarGif(this.state.avatar);
        }

    }

    post(url: string, data: object) {
        return new Promise((res,rej)=>{
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
                .then(r => r.json())
                .then(
                    r => {
                        // let data = r.data;
                        console.log(r)
                        // let d=document.createElement('div');
                        // d.innerHTML=data[0];
                        // let im:any=d.querySelector('img');
                        // this.setState({
                        //     avatar:im.src
                        // })
                        // localStorage.setItem('_avatar',im.src)
                        res(r)
                    }
                )
        })
        
    }

    async getDrivingVideos(){
        let url: any = (localStorage.getItem('_api_url')||'')+'/driving_video'
        let res = await this.post(url, {
            
        })
        return res
    }

    async createAvatarGif(base64: string) {
        let url: any = (localStorage.getItem('_api_url')||'')+'/create_avatar'
        let res:any = await this.post(url, {
            name: this.state.name,
            base64:base64.split(';base64,')[1],
            filename:this.state.name+'.png',
            emotion:this.state.drivingVideos.filter((f:any)=>f.selected)[0]?.emotion,
            type:'gif',
            isBase64:true
        })
        let data=res.data;
        this.setState({
            avatar:data.base64
        })
        // console.log(res)
        return res
    }

    blobToDataURI(blob: any) {
        var reader = new FileReader();
        return new Promise((res, rej) => {
            reader.onload = function (e: any) {
                res(e.target.result);
            }
            reader.readAsDataURL(blob);
        })
    }

    async writeClipImg(imgurl: string) {
        try {
            const data = await fetch(imgurl);
            const blob = await data.blob();

            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            console.log('Fetched image copied.');
        } catch (err) {
            console.error(err);
        }
    };

    async copy() {

        var item = new ClipboardItem({
            "text/html": new Blob(
                [this.state.result],
                { type: "text/html" }
            )
        });

        navigator.clipboard.write([item]).then(function (s) {
            /* success */
            console.log(s)
        }, function (e) {
            /* failure */
            console.log(e)
        });
    }
    selectDrivingVideos(index:number){
        let data=Array.from(this.state.drivingVideos,(v:any,i)=>{
            return {...v,selected:i===index}
        })
        this.setState({
            drivingVideos:data
        })
    }

    render() {
        console.log(this.state.names?.filter((n: any) => n.value == this.state.name)[0]?.value || '')
        return <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-start',
            height: '100vh',
            alignItems: 'center'
        }}>


            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>

                {
                    this.state.drivingVideos ? Array.from(this.state.drivingVideos, (v:any,i) => {
                        if(v.element=='video'){
                            return <video 
                            style={{width:'88px',height:'88px',outline:`${v.selected?'1px solid red':'none'}`}}
                            autoPlay
                            loop
                            src={v.base64}
                            key={i}
                            onClick={()=>this.selectDrivingVideos(i)}
                            ></video>
                               
                        }else if(v.element=='img'){
                            return <Image
                                radius="md"
                                src={v.base64}
                            />
                        }
                         
                    }) : ''
                }



                <Avatar size={88}
                    src={this.state.avatar} alt="it's me" onClick={() => this.loadImgBase64()} />


                <MultiSelect
                    label={'昵称'}
                    data={this.state.names}
                    placeholder='选择一个或新建'
                    maxSelectedValues={1}
                    defaultValue={[this.state.names?.filter((n: any) => n.value == this.state.name)[0]?.value || '']}
                    searchable
                    creatable
                    clearable
                    getCreateLabel={(query: any) => `+ 新建 ${query}`}
                    onChange={(e: any) => this.updateName(e)}
                    onCreate={(query: string) => {
                        // console.log('onCreate',this.state.names.filter((t:any) => t.value != query).length > 0)
                        const item = { value: query, label: query };
                        // 新标签
                        if (this.state.names.length == 0 ||
                            this.state.names.filter((t: any) => t.value != query).length > 0
                        ) {
                            // console.log('onCreate',that)
                            let names = [item, ...this.state.names];
                            this.setState({
                                names
                            });
                            localStorage.setItem('names', JSON.stringify(names))
                        }
                        return item
                    }}
                />


                <Textarea
                    value={this.state.dialogue}
                    placeholder='dialogue' onChange={(e: any) => this.updateDialogue(e)} />
                <Select data={types} value={this.state.type} onChange={(e: any) => this.updateType(e)} />
                <div className="buttons">
                    <Button
                        onClick={() => this.start()}
                        color="yellow"
                        rightIcon={<MdOutlineArrowDownward size={16} />} radius="lg" size="md">Start</Button>
                    <Button
                        onClick={() => this.copy()}
                        variant="default" radius="lg" size="md">Copy</Button>
                </div>
                {/* <div dangerouslySetInnerHTML={{ __html: this.state.result }}></div> */}


            </div >
            <iframe srcDoc={this.state.result}
                style={{
                    marginLeft: '24px',
                    width: '50%', height: '50%', border: 'none', outline: '1px dashed gray'
                }}></iframe>

        </div>

    }

}


const About = () => {

    return (
        <section id="about">
            <Container fluid style={{ width: '100%' }}>
                <Talks talkColors={
                    ['rgb(255 245 245)', 'rgb(246 255 245)', 'rgb(245 255 254)', 'rgb(247 245 255)', 'rgb(255 245 252)']
                } />
                {/* <div className="about-content">

                    <div style={{ marginBottom: 15 }}>
                        <Text transform="uppercase" weight={500} color="yellow">
                            MADE WITH REACT AND MANTINE
                        </Text>
                    </div>

                    <div style={{ marginBottom: 15 }}>
                        <Text>
                            <MediaQuery query="(max-width: 768px)" styles={{ fontSize: '2.8rem !important' }}>
                                <h1 className="title">Simple Mantine Template</h1>
                            </MediaQuery>
                        </Text>
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <Text size="xl" color="black">
                            Simple showcase of this powerful and well implemented library called <Anchor href="https://mantine.dev/">Mantine</Anchor>.
                        </Text>
                    </div>

                    <div className="buttons">
                        <Link to="section-one" smooth duration={500}>
                            <Button color="yellow" rightIcon={<MdOutlineArrowDownward size={16} />} radius="lg" size="md">Tell me more</Button>
                        </Link>

                        <Button variant="default" radius="lg" size="md">Other stuff</Button>
                    </div>

                </div> */}

            </Container>

        </section>
    );
};

export default About;
const createImage = async (imgurl: string) => {
  let im = document.createElement('img')
  return new Promise((res, rej) => {
    im.onload = () => {
      res(im)
    }
    im.src = imgurl
  })
}

const inLineText = (name: string, img: string, dialogue: string) => {
  return `<section class="mix-editor" style="margin: 2em 0;">
     <section style="margin: 0 16px;">
         <p style="
         font-size: 10px;display: inline;"><img src="${img}" 
         style="width: 32px;height: 32px;border-radius: 100%;border: 1px solid #e5e5e5;" 
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

export const createBaseHtml = async (
  avatar: string,
  type: string,
  name = '昵称',
  dialogue = '对白'
) => {
  let html = ''
  if (avatar) {
    if (type === 'oneImage') {
      html = await oneImageLayout(name, avatar, dialogue)
    } else if (type === 'left') {
      html = oneImageLayout2(name, avatar, dialogue)
    } else if (type === 'right') {
      html = oneImageLayout2(name, avatar, dialogue, false)
    } else if (type === 'inlineText') {
      html = inLineText(name, avatar, dialogue)
    }
  }
  if (type === 'talkClound') {
    const ds: any = dialogue.split('\n').filter(t => t)
    html = talkMore(avatar, ds)
  }

  return createCardByHtml(html)
}

export const createCardByHtml = (html: string) => {
  return `<div class="card">${html}</div>`
}

export const oneImageLayout = async (
  name: string,
  imgurl: string,
  dialogue: string
) => {
  // 配色方案
  var colors = {
    font: 'rgb(181, 181, 181)',
    background: '#fff8ee',
    highlight: ['rgb(255, 192, 56)', 'rgb(181, 181, 181)']
  }

  let dt = new Date()
  let im = await createImage(imgurl)
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
                      style="color: ${
                        colors.highlight[1]
                      }; font-size: 10px; line-height: 14px; font-family: '思源黑体'; letter-spacing: 1px; margin: 0">
                      ${dt.getFullYear()}.${
    dt.getMonth() + 1
  }.${dt.getDate()}</p>
              </section>
          </section>
          <section style="margin-top: 9px;">
              <p
                  style="color: ${
                    colors.highlight[1]
                  }; font-size: 14px; line-height: 14px; font-family: '思源黑体'; letter-spacing: 1px; margin: 0">
                  I LOVE TO TRAVEL</p>
          </section>
          <section style="margin-top: 13px;"><img
                  style="max-width: 100%; width: 100%; display: block; height: auto;border: 1px solid #e5e5e5;"
                  src="${imgurl}"
                  alt=""></section>
          <section
              style="width: 61px;height: 6px;background-color: ${
                colors.background
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

export const oneImageLayout2 = (
  title: string,
  imgurl: string,
  description: string,
  isLeft = true
) => {
  let oImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAYAAABE4bxTAAADA0lEQVRYR8XXX0hTURwH8O/vbrubFQmBL2IvuZmC4EMP/YEebFtCUO/VSxBRUA89BCG5p0TIwB6C8qGHFf2hQEsKI92cUOhDpkFJ7s6sQASfpDJxu39+cTZXmvtz73bN87Kxnfs9n3vO72znElbaoKK2kYNfBWrlt9nPNuOV/oKSJ4joPkA9umGEWna7pzYVFIuxU69R4wB2AdAJ6AFwze+Tx/8n7M8MiUEjSuosCN2rAQwegCFdD9Q5o0TEG41bA+pPsFuGNgNwdY6BPxHhVpJd94746MdGwdaAxCDRROoiAzcKDLgIxkMQhQM+16jdsHWg2Bf26JqqANhZbDACpgAKS5r2uLmh4mux/ma+XwdK11IidRrAHTMB2T4MvCNQj6TrvYfqPWJzlNRygsSOM2rUCQYaS0oFJon4qcHUG/TJE1YycoIyO04NgnjASlievjMAXjJ40FiSIy1N9KtQZl6QuGgwofYR+JgNqGxEiog7/V53KF9mQVA0sVzLkD4AqLAR9Y1Bp4I+13CuzIKgTIGrrQB32AgSUQ8cSde55kZa/De3KGhsjF3fK9XxMgo8570wUyhY52q3DMrUUmofAW8AOGycqQUGrgR98u3VmUVnKNs5Op28ykxtNoIA0ByD21ejTIPE0i1UqqME7LEXhQVm6lre5uw6Wk1LpkHppVOSDUQ0BmCLzSiAEJYMdFsCZXZd8iQgDnL2N3HUsQxaKfKbBFywm0QMkWu9PfnI8g63GgNwwPrVea+YB9HxkkAisj/BVS6oIwR4bUERdwa87sslgwQiNr3sNVgaYaCqLBQhAjLOB2o9SlkggRhSUnsNwlAZO08hGJf8Ps9zkVc2KF3kcTVAEvdZR9EsMYf8dXI4O8O2gNI/B3H1ICR+AWC7yeVTQOgIeOW7Jf11mBkkklD3Azyyvi/NApggGJNgirOTx/Wf8udchzXbZihdT/FUkyHhvXjPwDQIEQIPG5r2+nD91jkzN2UrSDwcMHCGmHrh0J+JXWMGsZFL1urQtEflPBL9BktnFDZhBW8qAAAAAElFTkSuQmCC`
  // console.log(description)
  description = description.replace(/\n/gi, '<br>')

  if (isLeft) {
    return `<section class="mix-editor" style='margin: 2em 0;'>
          <section style="display: flex;">
              <section style="display: inline-block;width: 56px;">
                  <section
                      style="width: 48px;height: 48px;overflow: hidden;border-radius: 50%;margin: 0px auto;text-align: center;box-sizing: border-box;border: 1px solid #e5e5e5;">
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
                      style="width: 48px;height: 48px;overflow: hidden;border-radius: 50%;margin: 0px auto;text-align: center;box-sizing: border-box;border: 1px solid #e5e5e5;">
                      <img src="${imgurl}" style="width: max-content; height: inherit;max-width: 100%;" class='mix-variable meta-human-avatar' variable-attribute='src'></section>
                  <p style="margin: 5px auto;color:#333;text-align:center;font-size: 10px;font-weight: 800;" class='mix-variable meta-human-name' variable-attribute='innerText'>${title}</p>
              </section>
              
          </section>
      </section>`
  }
}

export const talkMore = (img: string, texts = []) => {
  // let im= await Lab.ui.createImage(img);
  // let c=new Lab.Color();
  // let color=(await c.getColor(im))||[0,0,0];

  // console.log(texts)
  let isLeft = false
  let res = []
  for (const text of texts) {
    if (
      !window.talkColors ||
      (window.talkColors && window.talkColors.length <= 0)
    ) {
      window.talkColors = [
        'rgb(255 245 245)',
        'rgb(246 255 245)',
        'rgb(245 255 254)',
        'rgb(247 245 255)',
        'rgb(255 245 252)'
      ]
    }
    let color = window.talkColors.pop()
    if (isLeft) {
      res.push(`<section class="mix-editor" style='margin:12px 0;'>
              <section style="display: flex;">
                  <section style="display: flex;
                  max-width: 60%!important;
                  justify-content: flex-start;">
                      ${
                        texts.indexOf(text) >= texts.length - 2
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
                          ${
                            texts.indexOf(text) === 0
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

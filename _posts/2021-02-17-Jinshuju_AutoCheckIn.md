---
title: "用Python3实现金数据问卷自动打卡脚本"
date:   2021-02-17 17:00:00 +0800
categories: 技术分享
---

## 为什么要弄自动打卡程序

- 每天都要填写相同的内容，重复性劳动。CS要解决的就是人工重复性劳动
- 老是忘记填写，在学习时候被同学提醒或突然想起来，挺头疼的
- 道德方面：假期一直留校，出校需要填写申请并在指定时间返回。我的播客也从未主动向身边同学和朋友公布过，个人认为自己使用自动打卡脚本不会造成校方管理上的困难。

## 自动打卡需要哪些工具

以Win10为例，需要以下工具：

- 电脑一台
- Chrome、Edge等Chromium内核浏览器
- 学校金数据link （强烈建议自建1个和学校类似表单，毕竟知己知彼百战百胜）
- Python3及相关库
- Chromedriver（点击[链接](https://chromedriver.chromium.org/)官网下载最新稳定版中对应系统版本即可，如果因没有梯子问题打不开网络，可以先跳过，下有解决方法）
- CMD、Task Scheduler等Win10 内置App

## 如何配置

1. 首先创建文件夹，创建一个python文件并参考[该网站]([金数据问卷自动定时填报-selenium和schedule_c_du_ed_le_ni_niu_sc_selenium_ul_数据_自动_问卷 - 软件开发网 (mscto.com)](https://www.mscto.com/python/442232.html))粘贴代码。**还是建议用我的代码，原博主代码有点复杂。可对比我们俩代码来理解。**

2. 先将代码粘贴，下文会有配合代码注释即可轻松理解的代码详解。代码中有大量注释内容，不理会或删掉都行。如果感兴趣可以自己搜索看看，这些都是我走过的路或踩过的坑。

   ```python
   from selenium import webdriver
   from selenium.webdriver.common.by import By
   from selenium.webdriver.support.ui import WebDriverWait
   from selenium.webdriver.support import expected_conditions as EC
   from selenium.webdriver.chrome.options import Options
   import schedule
   import time
   from selenium.webdriver.common.keys import Keys
   
   # 创建参数选择（非必要内容，可根据个人需求选择是否添加）
   import argparse
   parser = argparse.ArgumentParser(description='Form - Test or School version（学校或个人测试）')
   
   # 我这为方便调试，增加了两个参数选项
   parser.add_argument('--formType', '-t', help='表单类型选择（学校或个人测试），必要参数，可选test或school，默认test',  default = 'test')
   parser.add_argument('--auto', '-a', help='是否自动提交表单，可选auto或manual，默认auto',  default = 'auto')
   args = parser.parse_args()
   
   chrome_options = Options()
   
   # 伪造机型，但是不建议使用，伪造成手机页面网页会失去高德地图地址搜索的搜索框，从而导致地理位置伪装失败。
   # mobile_emulation = {
   #     "deviceMetrics": { "width": 360, "height": 780, "pixelRatio": 3.0 },
   #     "userAgent": "Mozilla/5.0 (Linux; Android 10; zh-cn; RM-Note7-Pro) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/88.0.4324.96 Mobile Safari/535.19" 
   # }
   # chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
   
   # chrome_options.add_argument('--disable-gpu') # Use in win10 to enter headless mode
   # chrome_options.add_argument('--headless')
   # chrome_options.add_argument('--no-sandbox')
   # chrome_options.add_argument('--disable-dev-shm-usage')
   
   # 注意，chromedrive千万不能写相对地址，不然若cmd不在chromedriver所在文件夹执行时，大概率报错！！！TaskSchedule卡了1天多总算悟出的道理！！！
   driver = webdriver.Chrome(executable_path="D:\py-script\chromedriver.exe",chrome_options=chrome_options) 
   
   # 原本为了在服务器上打卡弄的fake location内容，
   # params = {
   #     "Latitude" : 39.000000,
   #     "Longitude" : 117.000000,
   #     "accuracy" : 1
   # }
   # driver.execute_cdp_cmd("Emulation.setGeolocationOverride", params)
   
   # driver.execute_script("window.navigator.geolocation.getCurrentPosition=function(success){"+
   #                                     "var position = {\"coords\" : {\"latitude\": \"39.712899\",\"longitude\": \"116.173464\"}};"+
   #                                     "success(position);}")
   
   # print(driver.execute_script("var positionStr=\"\";"+
   #                                 "window.navigator.geolocation.getCurrentPosition(function(pos){positionStr=pos.coords.latitude+\":\"+pos.coords.longitude});"+
   #                                 "return positionStr;"))
   
   def auto(formType, auto):
       # selection = 'school'
       selection = formType 
   
       if selection == 'school':
           link = 'https://jinshuju.net/f/xxxxxx' # School link
           addItem = '/span'
       else:
           link = 'https://jinshuju.net/f/xxxxx' # My test link
           addItem = ''
       
       # 个人表单链接
       driver.get(link)
   
       # Wait until the website totally load
       time.sleep(5)
   
       # 姓名
       name_input = driver.find_element_by_xpath(
           '//*[@id="root"]/div/form/div[3]/div/div[2]/div/div[2]/div/div/span'+addItem+'/input' 
       )
       name_input.send_keys('XXX') # 将XXX换为对应内容
       time.sleep(0.5)
   
   	# 学号
       id_input = driver.find_element_by_xpath(
           '//*[@id="root"]/div/form/div[3]/div/div[4]/div/div[2]/div/div/span'+addItem+'/input' 
       )
       id_input.send_keys('xxxxxxxx') # 将XXX换为对应内容
       time.sleep(0.5)
   
       # 班级选择
       # Suppose the first button is what we want to click (Change the value according to the form)
       num = 1 
       path_init = '//*[@id="root"]/div/form/div[3]/div/div[6]/div/div[2]/div/div/span/div/div[' + str(num) + ']/div/div/label/span[1]/input'
       print(path_init)
       class_input = driver.find_element_by_xpath(path_init)
       class_input.click()
       time.sleep(0.5)
   
       # 所在地定位
       # Click to get the initial location
       loc_input_first_time = driver.find_element_by_xpath(
           '//*[@id="root"]/div/form/div[3]/div/div[8]/div/div[2]/div/div/span/div/div/button'
       )
       loc_input_first_time.click()
       time.sleep(8)
   
       # Input your location in the fill box to change the location
       loc_location_fillIn = driver.find_element_by_xpath(
           '//*[@id="root"]/div/form/div[3]/div/div[8]/div/div[2]/div/div/span/div/div/div[2]/div[2]/div/input'
       )
       loc_location_fillIn.send_keys('XXXXXXXX') # 将XXX换为对应内容
       time.sleep(1)
   
       # After inputting your data, click the search button to refresh the latitude and longitude
       loc_location_search = driver.find_element_by_xpath(
           '//*[@id="root"]/div/form/div[3]/div/div[8]/div/div[2]/div/div/span/div/div/div[2]/div[2]/div/button'
       )
       loc_location_search.click()
       time.sleep(4)
   
   
       # Auto Submit
       if auto == 'auto':
           # Submit form
           submit_form = driver.find_element_by_xpath(
               '//*[@id="root"]/div/form/div[5]/div[1]/button'
           )
           submit_form.click()
           time.sleep(3)
           driver.quit()
    
   
   
   # # 定时功能：
   # schedule.every().day.at("11:32").do(auto)
   
   # while True:
   #     schedule.run_pending()
   #     time.sleep(1)
   
   if __name__ == '__main__':
       try:
           auto(args.formType, args.auto)
       except Exception as e:
           print(e)
   
   # print(args.auto)
   
   ```

   

3. pip安装需要的库，这个不多说

4. 上文Chromedriver打不开也可以在[ChromeDriver Mirror (taobao.org)](http://npm.taobao.org/mirrors/chromedriver/)下载，纯数字倒二链接既是最新稳定版下载地址。

   ![](https://i.imgur.com/MAoYsmR.png)

   ​	将下载好压缩包中的chromedriver文件也自创文件夹中。

5. （推荐）创建1个bat脚本文件，也放入文件夹中。现在大致有以下3个文件。（python和bat脚本名字可随便修改）

   ![文件夹包含内容](https://i.imgur.com/D5tNwzD.png)

6. 仿照上文提供的博主链接内容进行代码修改。

   1. 根据提供的内容在浏览器打开链接，并通过F12调出Inspect选项，找到填写内容对应的代码位置。每往下探索一级代码，网页视图代码对应地址就会变蓝。

      ![浏览器审查界面图片](https://i.imgur.com/HOkBryG.png)

   2. 具体到每一项内容，替换博客中对应代码

      如，在我的表单中有“填空题”、“单选题”（见上图）、“定位题”。“填空题”定位到填写框，“单选题”定位到对应选择按钮，“定位题”则需要：

      Ⅰ. 定位到“获取地理位置”按钮

      ![定位1](https://i.imgur.com/OgN6ftq.png)

      如我自创的表单中，该按钮对应地址为`//*[@id="root"]/div/form/div[3]/div/div[8]/div/div[2]/div/div/span/div/div/button`。希望大家能举一反三

      Ⅱ. 定位到搜索框、搜索（放大镜🔍）按钮

      ![定位2](https://i.imgur.com/3IThvES.png)

      在这特别说明一下地址的填写，因为每次用chromedriver进行高德地图定位时只能精确到所在市，而精确定位的话，浏览器默认要向用户请求定位权限。

      ![定位请求示例](https://i.imgur.com/CRt2wEQ.png)

      而我没有发现chromedriver有什么特别好的方法，如我注释的经纬度伪造定位代码无效。所以我们的表单要通过搜索地址这一下策来进行定位。

7. 打开Win10的定位权限。

   ![如在通知栏打开定位权限](https://i.imgur.com/8zCdpzS.png)

   

8. 打开Task Schedule（中文名叫 任务计划 / 计划任务），先在右边Actions选项中允许任务历史。

   ​	![](https://i.imgur.com/k88ZD9W.png)

   

   然后在Action中新建任务，我的设置如下：

   

   ![通用设置](https://i.imgur.com/BR9NZ8W.png)

   ![触发条件设置](https://i.imgur.com/sUS9F2w.png)

   ![行动设置](https://i.imgur.com/HL58K67.png)

   ![条件设置](https://i.imgur.com/YwHUGqt.png)

   ![其他设置](https://i.imgur.com/MH9nPGq.png)

9. bat敲入命令内容。我的是

   ```bat
   "C:\Users\hijacker\AppData\Local\Programs\Python\Python39\python.exe" "D:\py-script\aaa.py" "-t" "school"
   ```

   注意只要涉及代码中的空格就得将内容分开并用引号框住，不然会出错。

   

10. **（非常重要！！！）**在自创的表单中进行测试，看看表单创造者能获取哪些信息，自动打卡是否成功及数据是否准确，从而进行调整。

    ​	如返回值为0

    ![模拟运行后检查返回值](https://i.imgur.com/rtt78TS.png)

    

    自测表单中成功出现正确的填写内容

    ![](https://i.imgur.com/VS5Nudj.png)

    如在我的表单中需要特别注意填写地区和地理位置两个参数。如果不打开Win10定位又开启代理，也许会根据IP将你定位到“深圳”、“上海”等出国点，这样提交那就gg喽。如果地理位置处选项不对，注意检测对应按钮/填写框位置是否解析正确，看看 time.sleep 中设置的时间是否充足。有时会因网络拥堵而元素未完全加载导致解析错误。其他错误还请举一反三。

## 常见问题

1. CMD无法打开。PowerShell 和 Windows Terminal 都没问题，但CMD重启依旧无法解决。

   这是我至今无法复现明白的问题。但每次都是在task schedule的Action（行动）中直接敲对应代码导致，所以我后来用bat脚本来执行代码。

   遇到这种问题可依照[该方式](https://stackoverflow.com/a/61723109/10878775)解决。

2. Task Schedule返回值为2147942401

   **多数是因为自身代码运行问题导致错误。**先自行用CMD在当前目录为C盘的情况下，敲入bat内容进行测试。如果cmd能正常完整运行，再参照Stack Overflow[2147942401](https://stackoverflow.com/questions/48343993/batch-file-from-scheduled-task-returns-code-2147942401)回答。我在这卡了很久，总是以为是Task Schedule设置问题，后来发现是chromedriver用了相对地址从而引发的bug。

3. 已经拥有selenium或chromedriver但总是报错

   selenium检查python虚拟环境问题；chromedriver检查地址正反斜杠问题（bash和cmd不同）及是否用了绝对地址（详情参见代码）

4. 为什么不用阿里云等云服务器进行打卡

   因为问卷填写地址始终显示为“未知”且无法修改，伪装太假太容易被发现。虽然我的阿里云选的是北京服务器，但就是死活不显示为“北京市”。

其他问题可自行中英文Google解决

## 效果

打开电脑便可到点自动打卡；如果晚了会打开电脑，依旧能成功自动打卡。从此再也不被宿舍长催促，远离红尘。自由的感觉，怎一个爽字了的。

![](https://i.imgur.com/DcQlO62.png)


package com.howrunspringbootdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HowRunSpringbootDemoApplication {
    /*HTTP请求 →
    DispatcherServlet →
    HandlerMapping (找到对应的Controller) →
    拦截器 (PreHandle) →
    Controller方法执行 →
    服务层处理 →
    数据访问层处理 →
    返回Controller →
    拦截器 (PostHandle) →
    响应返回客户端*/



/*
* src/main/java/
├── com.example.application
│   └── Application.java                  // 启动类
├── com.example.config
│   ├── AppConfig.java                   // 主配置
│   ├── WebConfig.java                   // Web配置
│   └── SecurityConfig.java              // 安全配置
├── com.example.controller
│   ├── UserController.java              // 控制器
│   └── AuthController.java
├── com.example.service
│   ├── UserService.java                 // 服务接口
│   └── impl
│       └── UserServiceImpl.java         // 服务实现
├── com.example.repository
│   └── UserRepository.java              // 数据访问
├── com.example.entity
│   └── User.java                        // 实体类
└── com.example.dto
    ├── UserDTO.java                     // 数据传输对象
    └── ApiResponse.java                 // 统一响应
    * */


    /*
应用启动生命周期：

配置加载：@Configuration 类
Bean创建：@Component, @Service, @Repository, @Controller
依赖注入：@Autowired 或构造函数注入
后初始化：@PostConstruct 方法
服务就绪：Web服务器监听端口
请求处理生命周期：

请求接收：DispatcherServlet
路由匹配：找到对应的Controller方法
参数绑定：@RequestBody, @RequestParam 等
业务处理：Service层逻辑
数据持久化：Repository层操作
响应返回：Controller返回结果

6. 关键注解执行顺序

注解	执行时机	作用范围
@SpringBootApplication	应用启动	启动类
@Configuration	Bean定义时	配置类
@Bean	Bean创建时	方法
@Component	组件扫描时	类
@PostConstruct	依赖注入后	方法
@Controller	Web组件初始化	类
@RequestMapping	请求映射注册	方法

*/

    /**ces**/

    public static void main(String[] args) {
        SpringApplication.run(HowRunSpringbootDemoApplication.class, args);
    }

}

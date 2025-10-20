package com.howrunspringboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HowRunSpringbootApplication {
    //应用启动 → 配置加载 → Bean创建 → 依赖注入 → 服务就绪 → 请求处理
    /*
    1. @SpringBootApplication 启动
    2. 自动配置 (@EnableAutoConfiguration)
    3. 组件扫描 (@ComponentScan)
    4. 配置类加载 (@Configuration)
    5. Bean创建和依赖注入
    6. 服务层初始化 (@Service)
    7. Controller层初始化 (@Controller/@RestController)
    8. 嵌入式Web服务器启动 (Tomcat/Netty)
     */
    public static void main(String[] args) {
        SpringApplication.run(HowRunSpringbootApplication.class, args);
    }

}

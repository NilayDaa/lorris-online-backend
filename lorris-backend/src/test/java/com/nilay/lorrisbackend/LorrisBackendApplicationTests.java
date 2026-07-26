package com.nilay.lorrisbackend;


import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest(
    classes = LorrisBackendApplication.class,
    properties = {
        "spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration"
    }
)
class LorrisBackendApplicationTests {


    @Test
    void contextLoads() {

    }

}
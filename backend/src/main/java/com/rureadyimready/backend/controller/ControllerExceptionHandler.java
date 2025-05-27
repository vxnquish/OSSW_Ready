package com.rureadyimready.backend.controller;

import com.rureadyimready.backend.controller.dto.ChatResponseDTO;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.util.NoSuchElementException;

/**
 * Controller 예외 처리 진행해주는 클래스
 * 몇 개는 귀찮아서 이전에 만든 거 그대로 가져옴
 */
@RestControllerAdvice(annotations = RestController.class)
public class ControllerExceptionHandler {

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    @ExceptionHandler(FileNotFoundException.class)
    public String fileNotFoundHandler(FileNotFoundException e) {
        return "파일을 찾을 수 없습니다.";
    }

    @ResponseStatus(HttpStatus.INSUFFICIENT_STORAGE)
    @ExceptionHandler(MalformedURLException.class)
    public String malformedURLHandler(MalformedURLException e) {
        return "파일을 읽을 수 없습니다. 다시 시도해 주세요.";
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoSuchElementException.class)
    public String NoSuchElementHandler(NoSuchElementException e) {
        return e.getMessage() + " 링크가 올바른지, 파일이나 데이터가 삭제되지는 않았는지 확인 부탁드립니다.";
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NullPointerException.class)
    public String NullPointerHandler(NullPointerException e) {
        return "파일이나 데이터를 찾을 수 없습니다. 링크가 올바른지, 파일이나 데이터가 삭제되지는 않았는지 확인 부탁드립니다.";
    }

    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    @ExceptionHandler(FeignException.class)
    public ChatResponseDTO feignException(FeignException e) {
        return new ChatResponseDTO(e.getMessage());
    }
}
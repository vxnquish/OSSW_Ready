package com.rureadyimready.backend.openfeign;

import com.rureadyimready.backend.openfeign.dto.GPTResponseDTO;
import com.rureadyimready.backend.openfeign.dto.TogetherRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "gptClient", url = "https://api.openai.com")
public interface GptClient {
    @PostMapping(value = "/v1/chat/completions",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<GPTResponseDTO> chat(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody TogetherRequestDTO body);
}
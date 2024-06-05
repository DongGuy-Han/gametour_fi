package com.project.gametour.controller;

import com.project.gametour.dto.UserRequestDto;
import com.project.gametour.dto.UserResponseDto;
import com.project.gametour.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping("/users") // 유저 생성하기
    public ResponseEntity<UserResponseDto> create(@RequestBody UserRequestDto userRequestDto) {
        UserResponseDto created = userService.create(userRequestDto);

        return (created != null) ?
                ResponseEntity.status(HttpStatus.OK).body(created) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/users/{id}") // 특정 유저 정보 가져오기
    public ResponseEntity<UserResponseDto> show(@PathVariable Long id) {
        UserResponseDto searched = userService.show(id);

        return (searched != null) ?
                ResponseEntity.status(HttpStatus.OK).body(searched) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PatchMapping("/users/update/{id}") // 특정 유저 정보 업데이트
    public ResponseEntity<UserResponseDto> update(@PathVariable Long id, @RequestBody UserRequestDto userRequestDto) {
        UserResponseDto updated = userService.update(id, userRequestDto);

        return (updated != null) ?
                ResponseEntity.status(HttpStatus.OK).body(updated) :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("/users/delete/{id}") // 특정 유저 삭제
    public ResponseEntity<UserResponseDto> delete(@PathVariable Long id) {
        UserResponseDto deleted = userService.delete(id);
        return (deleted != null) ?
                ResponseEntity.status(HttpStatus.NO_CONTENT).build() :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/api/user")
    public ResponseEntity<?> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("anonymousUser");
        }
        return ResponseEntity.ok(authentication);
    }
}

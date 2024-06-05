package com.project.gametour.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private Double starPoint;
    private LocalDateTime createDate;

    @ManyToOne
    private Game game;

    @ManyToOne
    private User user;

    @ManyToMany
    private Set<User> liker;
}

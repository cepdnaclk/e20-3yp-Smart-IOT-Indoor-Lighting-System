package com.example.Lightify.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AreaDetail {
    private String type;
    private String name;
    private String equation;
    private List<Integer> x;
    private List<Integer> y;
}


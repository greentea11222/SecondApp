package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Memo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(columnDefinition = "TEXT") //DB上の型をTEXTに指定
	private String content;
	
	//多対1のリレーション。多くのメモが1冊の本に紐付く。
	@ManyToOne
	//DB上のカラム名をbook_idにし、外部キーとして本と連結
	@JoinColumn(name = "book_id")
	private Book book;
}

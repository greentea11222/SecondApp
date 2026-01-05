package com.example.demo.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity //データベースのテーブルとして扱うことを宣言
public class Book {
	@Id //このフィールドを主キーに設定
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String title;
	private String author;
	private String thumbnailUrl;
	
	@OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
	private List<Memo> memos;
}

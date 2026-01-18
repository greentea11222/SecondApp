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
	@GeneratedValue(strategy = GenerationType.IDENTITY) //IDを自動採番
	private Long id;
	
	private String title;
	private String author;
	private String thumbnailUrl;
	
	//1対多のリレーション。book変数と紐付き、本を削除したらそのメモも一緒に消える
	@OneToMany(mappedBy = "book", cascade = CascadeType.ALL)
	private List<Memo> memos;
	
	//Getter/Setter
	public Long getId() { return this.id;}
	public String getTitle() { return this.title;}
	public String getAuthor() { return this.author;}
	public String getThumbnailUrl() { return this.thumbnailUrl;}
	public List<Memo> getMemos(){ return this.memos;}
	
	public void setId(Long id) { this.id = id;}
	public void setTitle(String title) { this.title = title;}
	public void setAuthor(String author) { this.author = author;}
	public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl;}
	public void setMemos(List<Memo> memos) { this.memos = memos;}
	
}

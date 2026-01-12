package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Book;
import com.example.demo.service.BookService;

@RestController
@RequestMapping("/api/books")
//3000番のReactからのアクセスを許可
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {
	private final BookService bookService;
	
	public BookController(BookService bookService) {
		this.bookService = bookService;
	}
	
	@PostMapping("/save")
	public Book save(@RequestBody Book book) {
		//フロントエンドから送られてきた本のデータを保存
		return bookService.saveBook(book);
	}
	
	@GetMapping("/search")
	public String search(@RequestParam String query) {
		return bookService.searchBooks(query);
	}
}

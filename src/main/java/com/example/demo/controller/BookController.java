package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Book;
import com.example.demo.model.Memo;
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
	
	//App.jsから届いたJSON形式のbookDataを、@RequestBodyが受け取り、Jacksonライブラリを使って変換する
	//JSONのtitleをBookクラスの変数にセット
	@PostMapping("/save")
	public Book save(@RequestBody Book book) {
		//フロントエンドから送られてきた本のデータを保存
		return bookService.saveBook(book);
	}
	
	//queryをキーワードとして本を検索
	@GetMapping("/search")
	public String search(@RequestParam String query) {
		return bookService.searchBooks(query);
	}
	
	//保存された本を全件取得
	@GetMapping("/my-library")
	public List<Book> getMyLibrary(){
		return bookService.getAllBooks();
	}
	
	//特定の本にメモを保存する
	@PostMapping("/{bookId}/memos")
	public Memo addMemo(@PathVariable Long bookId, @RequestBody Memo memo) {
		return bookService.addMemoToBook(bookId, memo);
	}
	
	//本を削除
	@DeleteMapping("/{id}")
	public void deleteBook(@PathVariable Long id) {
		bookService.deleteBook(id);
	}
	
	//メモを削除
	@DeleteMapping("/memos/{memoId}")
	public void deleteMemo(@PathVariable Long memoId) {
		bookService.deleteMemo(memoId);
	}
}

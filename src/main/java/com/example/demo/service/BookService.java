package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.model.Book;
import com.example.demo.model.Memo;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.MemoRepository;

@Service
public class BookService {
	//RestTemplate：REST API(Web API)を呼び出すためのメソッドを提供するクラス
	private final RestTemplate restTemplate;
	private final BookRepository bookRepository;
	private final MemoRepository memoRepository;
	
	//コンストラクタ
	public BookService(RestTemplate restTemplate,
			BookRepository bookRepository, MemoRepository memoRepository) {
		this.restTemplate = restTemplate;
		this.bookRepository = bookRepository;
		this.memoRepository = memoRepository;
	}
	
	//本をデータベースに保存
	public Book saveBook(Book book) {
		return bookRepository.save(book);
	}
	
	//queryに検索キーワードを入れてGoogle APIで検索
	public String searchBooks(String query) {
		String url = "https://www.googleapis.com/books/v1/volumes?q=" + query;
		//デフォルトではJSON形式で返ってくるので、String型（加工前の生テキスト）として受け取る
		return restTemplate.getForObject(url,  String.class);
	}
	
	public List<Book> getAllBooks(){
		return bookRepository.findAll();
	}
	
	//本にメモを追加
	public Memo addMemoToBook(Long bookId, Memo memo) {
		//メモを紐付ける本をDBから探す
		Book book = bookRepository.findById(bookId)
				.orElseThrow(() -> new RuntimeException("本が見つかりません"));
		
		//メモに本をセットして保存
		memo.setBook(book);
		return memoRepository.save(memo);
	}
	
	//本を削除
	public void deleteBook(Long id) {
		bookRepository.deleteById(id);
	}
	
	//メモを削除
	public void deleteMemo(Long memoId) {
		memoRepository.deleteById(memoId);
	}
	
}

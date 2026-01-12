package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.model.Book;
import com.example.demo.repository.BookRepository;

@Service
public class BookService {
	private final RestTemplate restTemplate;
	private final BookRepository bookRepository;
	
	public BookService(RestTemplate restTemplate, BookRepository bookRepository) {
		this.restTemplate = restTemplate;
		this.bookRepository = bookRepository;
	}
	
	public Book saveBook(Book book) {
		return bookRepository.save(book);
	}
	
	public String searchBooks(String query) {
		String url = "https://www.googleapis.com/books/v1/volumes?q=" + query;
		return restTemplate.getForObject(url,  String.class);
	}
}

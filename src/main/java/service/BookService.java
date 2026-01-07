package service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BookService {
	private final RestTemplate restTemplate;
	
	public BookService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}
	
	public String searchBooks(String query) {
		String url = "https://www.googleapis.com/books/v1/volumes?q=" + query;
		return restTemplate.getForObject(url,  String.class);
	}
}

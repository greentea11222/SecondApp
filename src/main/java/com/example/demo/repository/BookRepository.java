package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Book;

//JpaRepositoryを継承することで、save(), findAll(), deleteById()が使える
//Book型のエンティティを使い、そのIDの型はLongと宣言
public interface BookRepository extends JpaRepository<Book, Long> {
	
}

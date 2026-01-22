package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Book;

//JpaRepositoryを継承することで、save(), findAll(), deleteById()が使える
//JpaRepository<Book, Long>：第1引数（Book)をエンティティとして扱い、第2引数（Long）が主キー（＠Id）の型
public interface BookRepository extends JpaRepository<Book, Long> {
	/*
	 * save()
	 * BookService.javaからsave(book)が呼び出されたときの動き
	 * ①Bookインスタンスのid(@Idがついている変数)が空か確認
	 * ②idが空の場合はINSERT文でデータベースに新規保存
	 * ③idが入っていれば、UPDATE文でデータベースを更新する
	 * 
	 * 
	 */
}

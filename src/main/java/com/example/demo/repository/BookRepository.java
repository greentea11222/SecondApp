package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Book;

//JpaRepositoryを継承することで、save(), findAll(), deleteById()が使える
//JpaRepository<Book, Long>：第1引数（Book)をエンティティとして扱い、第2引数（Long）が主キー（＠Id）の型
public interface BookRepository extends JpaRepository<Book, Long> {
	/*
	 * save()
	 * BookServiceからsave(book)が呼び出されると……
	 * ①Bookインスタンスのid(@Idがついている変数)が空か確認
	 * ②idが空の場合はINSERT文でデータベースに新規保存
	 * ③idが入っていれば、UPDATE文でデータベースを更新する
	 * 
	 * findAll()
	 * BookServiceからfindAll()が呼び出されると……
	 * ①Bookクラスについているアノテーションを確認し、
	 * SELECT * FROM book;を発行
	 * ②データベースがそれに応じて全件取り出し
	 * ③データベースから戻ってきた表形式のデータを、1行ずつBookクラスのインスタンスに詰め直す
	 * ④それらを全てまとめてList<Book>としてBookServiceに返却
	 * 
	 * deleteById()
	 * BookServiceからdeleteById(id)が呼び出されると……
	 * ①そのidのデータが存在するか確認する
	 * SELECT * FROM book WHERE id = ?;
	 * ②ある場合は削除
	 * DELETE FROM book WHERE id = ?;
	 * Book.javaのmemosに以下の設定をしているため、メモも自動的に消える
	 * @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
	 * ③存在しない場合はエラーを投げる
	 */
}

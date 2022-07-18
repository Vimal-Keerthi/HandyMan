create database handyman;
use handyman;


create table users(username varchar(10), pass varchar(10));
create table userinfo (username varchar(10) primary key, fname varchar(20), lname varchar(20), address varchar(50), phone varchar(10));

create table rating(username varchar(10), stars int, pplvoted int);
create table posts (post_id int, username varchar(10), rel_path varchar(50), price float, category varchar(40), about varchar(100), address varchar(50));

select * from posts;
select * from rating;
select * from userinfo;
select * from users;


delete from posts;





# deleting the contents

delete from posts;
delete from rating;
delete from userinfo;
delete from users ;
delete from rating where stars=0 and username = "rithu15";
delete from users where username = "rithu15";
delete from userinfo where username = "rithu15";



drop table users;
drop table userinfo;

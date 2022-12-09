'use strict';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement: ', clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post.active');

  for (const activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const getArticleAttribute = clickedElement.getAttribute('href');
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const foundAricle = document.querySelector(getArticleAttribute);
  /* [DONE] add class 'active' to the correct article */
  foundAricle.classList.add('active');
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles';

const generateTitleLinks = function () {
  //console.log(event);

  /* remove content of links list on the left side of the column  */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for every aricle: */
  const articles = document.querySelectorAll(optArticleSelector);

  let html = '';
  for (const article of articles) {
    /* read his "id" and save it to constant, */
    const articleId = article.getAttribute('id');

    /* find an element with a title and save it's value to constant, */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */

    /* create html code of this link and save it to constant, */
    const linkHTML =
      '<li><a href="#' +
      articleId +
      '"><span>' +
      articleTitle +
      '</span></a></li>';
    console.log(linkHTML);
    /* put created html code to list of links in the left column */
    /*titleList.innerHTML = titleList.innerHTML + linkHTML;*/
    /*titleList.insertAdjacentHTML('beforeend', linkHTML);*/
    html = html + linkHTML;
    console.log(html);
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  console.log(links);
  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }
};

generateTitleLinks();

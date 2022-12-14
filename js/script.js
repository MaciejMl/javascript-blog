'use strict';

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tagCloud-link').innerHTML
  ),
  authorListLink: Handlebars.compile(
    document.querySelector('#template-authorsList-link').innerHTML
  ),
};

const opts = {
  tagSizes: {
    count: 4,
    classPrefix: 'tag-size-',
  },
  titleSelector: '.post-title',
};

const select = {
  all: {
    articles: '.post',
    activeArticles: '.post.active',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#auth-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    titlesLinks: '.titles a.active',
    tags: '.tags.list',
    authors: '.authors.list',
  },
};

//const //optArticleSelector = '.post',
//optTitleSelector = '.post-title',
//optTitleListSelector = '.titles',
//optArticleTagsSelector = '.post-tags .list',
//optAuthorSelector = '.post .post-author',
//optTagsListSelector = '.tags.list',
//optCloudClassCount = 4,
//optCloudClassPrefix = 'tag-size-',
//optAuthorsListSelector = '.list.authors';

const loogoo = document.querySelector('.logo-1');
loogoo.style.color = 'firebrick';

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  //console.log(event);

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll(select.listOf.titlesLinks);

  for (const activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  //console.log('clickedElement: ', clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(select.all.activeArticles);

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

function generateTitleLinks(customSelector = '') {
  /* remove content of links list on the left side of the column  */
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';

  /* for every aricle: */
  const articles = document.querySelectorAll(
    select.all.articles + customSelector
  );
  //console.log(customSelector);

  let html = '';
  for (const article of articles) {
    /* read his "id" and save it to constant, */
    const articleId = article.getAttribute('id');

    /* find an element with a title and save it's value to constant, */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;
    /* get the title from the title element */

    /* create html code of this link and save it to constant, */
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);

    /*const linkHTML =
      '<li><a href="#' +
      articleId +
      '"><span>' +
      articleTitle +
      '</span></a></li>';*/
    // console.log(linkHTML);
    /* put created html code to list of links in the left column */
    /*titleList.innerHTML = titleList.innerHTML + linkHTML;*/
    /*titleList.insertAdjacentHTML('beforeend', linkHTML);*/
    html = html + linkHTML;
    // console.log(html);
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  //console.log(links);
  for (const link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags) {
  let params = {
    max: 0,
    min: 99999,
  };

  for (let tag in tags) {
    params.max = Math.max(params.max, tags[tag]);
    params.min = Math.min(params.min, tags[tag]);
  }
  return params;
}

function calculateTagClass(count, params) {
  const classNumber = Math.floor(
    ((count - params.min) / (params.max - params.min)) * opts.tagSizes.count + 1
  );
  //return 'class="' + optCloudClassPrefix + classNumber + '"';
  return opts.tagSizes.classPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  //console.log(articles);
  /* START LOOP: for every article: */
  for (const article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(select.article.tags);
    //console.log(tagWrapper);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);
    /* split tags into array */
    const tagsArray = articleTags.split(' ');
    //console.log(tagsArray);
    /* START LOOP: for each tag */
    for (const tag of tagsArray) {
      /* generate HTML of the link */
      const HTMLlinkData = { 'tag-word': tag };
      const HTMLlink = templates.tagLink(HTMLlinkData);
      /*const HTMLlink =
        '<li><a href="#tag-' + tag + '">' + tag + '&nbsp</a></li>';*/
      //console.log(HTMLlink);
      /* add generated code to html variable */
      html = html + HTMLlink;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
    //console.log(html);
    /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  console.log(tagList);
  /* [NEW] add html from allTags to tagList */
  //let dd = (tagList.innerHTML = allTags.join(' '));

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  const allTagsData = { tags: [] };
  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /*const tagLinkHTML =
      '<li class="cloud"><a ' +
      calculateTagClass(allTags[tag], tagsParams) +
      ' href="#tag-' +
      tag +
      '">' +
      tag +
      '&nbsp</a></li>';*/
    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams),
    });

    /* [NEW] END LOOP: for each tag in allTags: */
  }

  /*[NEW] add HTML from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);

  //console.log(allTagsData);
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  //console.log(clickedElement);
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  //console.log(tag);
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll(select.all.linksTo.tags);
  //console.log(activeTagLinks);
  /* START LOOP: for each active tag link */
  for (const activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log(tagLinks);
  /* START LOOP: for each found tag link */
  for (const tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll(select.all.linksTo.tags);
  //console.log(links);
  /* START LOOP: for each link */
  for (const link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function generateAuthors() {
  /* [new] create new variable allAuthors with empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  //console.log(articles);
  /* for each article create loop */
  for (const article of articles) {
    /* find wrapper for author name  */
    const authWrapper = article.querySelector(select.article.author);
    //console.log(authWrapper);
    /* get author attribute from "data-author" */
    const author = article.getAttribute('data-author');
    //console.log(author);
    /* create author link */
    const linkHTMLData = { 'author-name': author };
    const linkHTML = templates.authorLink(linkHTMLData);

    /*const linkHTML = '<a href="#auth-' + author + '">by ' + author + '</a>';*/
    //console.log(linkHTML);
    /* [new] check if new link is Not in allAuthors */
    if (!allAuthors[author]) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    /* write author link to wrapper */
    authWrapper.innerHTML = linkHTML;
  }
  /* [new] find  list of authors in right collumn */
  const authList = document.querySelector(select.listOf.authors);
  console.log(authList);
  const allAuthorsData = { authors: [] };
  //let allAuthorsHTML = '';
  /* close loop */
  for (let author in allAuthors) {
    /*const authorsLink =
      '<li><a href="#auth-' +
      author +
      '"><span class="author-name">' +
      author +
      ' ( ' +
      allAuthors[author] +
      ' )</span></a></li>';*/
    //allAuthorsHTML += authorsLink;
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  }
  authList.innerHTML = templates.authorListLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event) {
  /* write prevent defoult for event */
  event.preventDefault();
  /* create constant clickedElement as a this */
  const clickedElement = this;
  /* create href constant with "href" atributes of clicked author */
  const href = clickedElement.getAttribute('href');
  //console.log(href);
  /* make a new constant "author" and extract author's name from the "href" constant */
  const author = href.replace('#auth-', '');
  //console.log(author);
  /* find all authors links with class active */
  const activeAuthLinks = document.querySelectorAll(select.all.linksTo.authors);
  //console.log(activeAuthLinks);
  /* create loop for each active author link */
  for (const activeAuthLink of activeAuthLinks) {
    /* remove class active */
    activeAuthLink.classList.remove('active');
    /* end loop */
  }
  /* find all author links with "href" attribute equal to the "href" constant */
  const authLinks = document.querySelectorAll('a[href="' + href + '"]');
  //console.log(authLinks);
  /* START LOOP: for each found author link */
  for (const authLink of authLinks) {
    /* add class active */
    authLink.classList.add('active');
    /* end loop for each active author link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  /* find all links authors */
  const links = document.querySelectorAll(select.all.linksTo.authors);
  //console.log(links);
  /*start loop for each link */
  for (const link of links) {
    /* add authorClickHandler as event listenter for the link */
    link.addEventListener('click', authorClickHandler);
    /* end loop for each link */
  }
}

addClickListenersToAuthors();

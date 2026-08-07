# GitHub Pages 배포 메모

이 프로젝트는 GitHub Pages용 GitHub Actions 워크플로가 이미 포함되어 있습니다.

## 필요한 것

- GitHub 계정
- 새 GitHub 저장소 1개

## 배포 순서

1. `english-syllable-quiz` 폴더를 GitHub 저장소에 업로드합니다.
2. 기본 브랜치를 `main`으로 둡니다.
3. GitHub 저장소의 `Settings > Pages`로 이동합니다.
4. `Source`를 `GitHub Actions`로 선택합니다.
5. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

## 배포 주소 형식

- 일반 저장소일 때:
  `https://<github-id>.github.io/<repository-name>/`

예시:

- GitHub ID가 `exampleuser`
- 저장소 이름이 `english-syllable-quiz`

이면 주소는:

- `https://exampleuser.github.io/english-syllable-quiz/`

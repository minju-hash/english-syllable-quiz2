# English Syllable Quiz

영어 음절 학습용 정적 퀴즈 앱입니다.

## 배포용 상태

이 프로젝트는 빌드 도구 없이 바로 배포할 수 있는 정적 사이트입니다.

- 시작 파일: `index.html`
- 스타일: `styles.css`
- 동작 로직: `script.js`

## 배포 방법

### 1. Vercel

1. Vercel에 새 프로젝트를 만듭니다.
2. 이 폴더 전체를 업로드하거나 Git 저장소를 연결합니다.
3. Framework Preset은 `Other` 또는 `No Framework`로 둡니다.
4. Root Directory를 현재 폴더로 설정합니다.
5. 배포합니다.

이 프로젝트에는 `vercel.json`이 포함되어 있어 정적 파일로 바로 서비스됩니다.

### 2. Netlify

1. Netlify에서 `Add new site`를 선택합니다.
2. 이 폴더 전체를 드래그 앤 드롭하거나 Git 저장소를 연결합니다.
3. Build command는 비워 둡니다.
4. Publish directory는 `/` 또는 현재 폴더 루트를 사용합니다.
5. 배포합니다.

이 프로젝트에는 `netlify.toml`이 포함되어 있어 `index.html`이 기본 진입점으로 동작합니다.

### 3. GitHub Pages

1. GitHub 저장소를 만듭니다.
2. 현재 폴더 파일을 저장소 루트에 업로드합니다.
3. GitHub 저장소의 `Settings > Pages`로 이동합니다.
4. Branch를 `main`으로, 폴더를 `/root`로 선택합니다.
5. 저장 후 생성된 `https://...github.io/.../` 주소로 접속합니다.

## 로컬 테스트

Python이 있으면 아래 명령으로 테스트할 수 있습니다.

```powershell
python -m http.server 4180
```

그 뒤 브라우저에서 아래 주소를 엽니다.

```text
http://127.0.0.1:4180/
```

## 참고

- 이 프로젝트는 정적 사이트이므로 별도 서버 코드가 없습니다.
- 다른 장소에서도 안정적으로 사용하려면 `file:///` 방식이 아니라 `https://`로 배포된 주소를 사용해야 합니다.

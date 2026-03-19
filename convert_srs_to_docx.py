import re
import zipfile
from xml.sax.saxutils import escape

md_path = r"e:\New folder\Projects\VibeApp\VibeApp-SRS.md"
out_path = r"e:\New folder\Projects\VibeApp\VibeApp-SRS.docx"

with open(md_path, "r", encoding="utf-8") as f:
    md_lines = f.read().splitlines()

cover_title = "Software Requirements Specification (SRS)"
cover_project = "Vibe (Full-Stack Social Media App)"
cover_version = "1.0"
cover_date = "2026-02-26"
cover_prepared = "Project evaluator"

paragraphs = []

heading_re = re.compile(r"^(#{1,3})\s+(.*)$")
list_re = re.compile(r"^[-*]\s+(.*)$")

for line in md_lines:
    if not line.strip():
        paragraphs.append(("Normal", ""))
        continue

    m = heading_re.match(line)
    if m:
        level = len(m.group(1))
        text = m.group(2).strip()
        style = {1: "Heading1", 2: "Heading2", 3: "Heading3"}[level]
        paragraphs.append((style, text))
        continue

    lm = list_re.match(line)
    if lm:
        text = "- " + lm.group(1).strip()
        paragraphs.append(("Normal", text))
        continue

    text = line.replace("**", "").replace("`", "")
    paragraphs.append(("Normal", text))


def p(style, text):
    text = escape(text)
    if style == "Normal":
        if text == "":
            return "<w:p/>"
        return f"<w:p><w:r><w:t xml:space=\"preserve\">{text}</w:t></w:r></w:p>"
    return (
        "<w:p>"
        f"<w:pPr><w:pStyle w:val=\"{style}\"/></w:pPr>"
        f"<w:r><w:t xml:space=\"preserve\">{text}</w:t></w:r>"
        "</w:p>"
    )


def page_break():
    return "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>"


body_parts = []

body_parts.append(p("Heading1", cover_title))
body_parts.append(p("Normal", ""))
body_parts.append(p("Normal", f"Project: {cover_project}"))
body_parts.append(p("Normal", f"Version: {cover_version}"))
body_parts.append(p("Normal", f"Date: {cover_date}"))
body_parts.append(p("Normal", f"Prepared for: {cover_prepared}"))
body_parts.append(page_break())

body_parts.append(p("Heading1", "Table of Contents"))
body_parts.append(
    "<w:p>"
    "<w:fldSimple w:instr=\"TOC \\o \\\"1-3\\\" \\h \\z \\u\">"
    "<w:r><w:t>Right-click to update field</w:t></w:r>"
    "</w:fldSimple>"
    "</w:p>"
)
body_parts.append(page_break())

for style, text in paragraphs:
    body_parts.append(p(style, text))

body_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<w:document "
    "xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\" "
    "xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">"
    "<w:body>"
    + "".join(body_parts)
    + "<w:sectPr>"
    "<w:pgSz w:w=\"12240\" w:h=\"15840\"/>"
    "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\" w:header=\"720\" w:footer=\"720\" w:gutter=\"0\"/>"
    "</w:sectPr>"
    "</w:body>"
    "</w:document>"
)

content_types_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">"
    "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>"
    "<Default Extension=\"xml\" ContentType=\"application/xml\"/>"
    "<Override PartName=\"/word/document.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml\"/>"
    "<Override PartName=\"/docProps/core.xml\" ContentType=\"application/vnd.openxmlformats-package.core-properties+xml\"/>"
    "<Override PartName=\"/docProps/app.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.extended-properties+xml\"/>"
    "</Types>"
)

rels_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">"
    "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"word/document.xml\"/>"
    "<Relationship Id=\"rId2\" Type=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\" Target=\"docProps/core.xml\"/>"
    "<Relationship Id=\"rId3\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\" Target=\"docProps/app.xml\"/>"
    "</Relationships>"
)

word_rels_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"></Relationships>"
)

core_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<cp:coreProperties "
    "xmlns:cp=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\" "
    "xmlns:dc=\"http://purl.org/dc/elements/1.1/\" "
    "xmlns:dcterms=\"http://purl.org/dc/terms/\" "
    "xmlns:dcmitype=\"http://purl.org/dc/dcmitype/\" "
    "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">"
    f"<dc:title>{escape(cover_title)}</dc:title>"
    f"<dc:subject>{escape(cover_project)}</dc:subject>"
    f"<dc:creator>{escape(cover_prepared)}</dc:creator>"
    f"<cp:lastModifiedBy>{escape(cover_prepared)}</cp:lastModifiedBy>"
    "<dcterms:created xsi:type=\"dcterms:W3CDTF\">2026-02-26T00:00:00Z</dcterms:created>"
    "<dcterms:modified xsi:type=\"dcterms:W3CDTF\">2026-02-26T00:00:00Z</dcterms:modified>"
    "</cp:coreProperties>"
)

app_xml = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>"
    "<Properties xmlns=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\" "
    "xmlns:vt=\"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes\">"
    "<Application>Vibe SRS Generator</Application>"
    "</Properties>"
)

with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    zf.writestr("[Content_Types].xml", content_types_xml)
    zf.writestr("_rels/.rels", rels_xml)
    zf.writestr("word/document.xml", body_xml)
    zf.writestr("word/_rels/document.xml.rels", word_rels_xml)
    zf.writestr("docProps/core.xml", core_xml)
    zf.writestr("docProps/app.xml", app_xml)

print(out_path)
